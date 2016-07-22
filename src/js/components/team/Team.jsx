import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import _ from 'lodash';

import {SchemePicker, Table, Toolbar} from '../global';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {Button} from '../forms';
import {Add, Docs, Edit, Logout, Key} from '../icons';
import {Heading} from '../type';
import {flag} from '../../modules';
import {
  team as actions,
  user as userActions,
  onboard as onboardActions
} from '../../actions';
import {SlackInfo, PagerdutyInfo} from '../integrations';
import {NotificationItemList} from '../checks';
import style from './team.css';

const Profile = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getTeam: PropTypes.func
    }),
    userActions: PropTypes.shape({
      logout: PropTypes.func.isRequired
    }).isRequired,
    onboardActions: PropTypes.shape({
      getDefaultNotifications: PropTypes.func.isRequired
    }).isRequired,
    redux: PropTypes.shape({
      team: PropTypes.object.isRequired,
      user: PropTypes.object.isRequired,
      asyncActions: PropTypes.shape({
        teamGet: PropTypes.object,
        onboardGetDefaultNotifs: PropTypes.object.isRequired
      }).isRequired,
      env: PropTypes.shape({
        activeBastion: PropTypes.object
      }),
      onboard: PropTypes.shape({
        defaultNotifs: PropTypes.array
      })
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object
    })
  },
  componentWillMount() {
    this.props.actions.getTeam();
    if (!this.props.redux.asyncActions.onboardGetDefaultNotifs.history.length){
      this.props.onboardActions.getDefaultNotifications();
    }
  },
  getInitialState() {
    return {
      start: {},
      showInactive: false
    };
  },
  getTeamData(){
    return this.props.redux.team.toJS();
  },
  getMembers(team){
    return _.chain(team)
    .get('users')
    .sortBy(user => {
      let sorter = user.email;
      if (user.email === user.email){
        sorter = 'aaaaa';
      }
      if (!user.name){
        sorter = 'zz';
      }
      if (user.status && user.status === 'inactive'){
        sorter = 'zzzz';
      }
      return sorter;
    })
    .reject(user => {
      if (!this.state.showInactive){
        return user.status && user.status === 'inactive';
      }
      return null;
    })
    .value();
  },
  getPlan(team){
    let plan = team.subscription_plan;
    if (plan === 'beta'){
      plan = 'Team (beta)';
    }
    return _.capitalize(plan);
  },
  runShowAll(e){
    e.preventDefault();
    this.setState({
      showInactive: true
    });
  },
  renderSlackArea(){
    if (flag('integrations-slack')){
      return (
        <tr>
          <td colSpan={2}>
            <Row>
              <Col xs={12} sm={4}>
                <strong>Slack</strong>
              </Col>
              <Col xs={12} sm={8}>
                <SlackInfo connect redirect={`${window.location.origin}/team?slack=true`}/>
              </Col>
            </Row>
          </td>
        </tr>
      );
    }
    return null;
  },
  renderPagerdutyArea(){
    if (flag('integrations-pagerduty')){
      return (
        <tr>
          <td colSpan={2}>
            <Row>
              <Col xs={12} sm={4}>
                <strong>PagerDuty</strong><br/>
              </Col>
              <Col xs={12} sm={8}>
                <PagerdutyInfo redirect={`${window.location.origin}/team?pagerduty=true`}/>
              </Col>
            </Row>
          </td>
        </tr>
      );
    }
    return null;
  },
  renderAWSArea(){
    if (!!this.props.redux.env.activeBastion){
      return (
        <tr>
          <td colSpan={2}>
            <Row>
              <Col xs={12} sm={4}>
                <strong>AWS Integration</strong><br/>
              </Col>
              <Col xs={12} sm={8}>
                <Link to="/system">Enabled</Link>
              </Col>
            </Row>
          </td>
        </tr>
      );
    }
    return (
      <tr>
        <td colSpan={2}>
          <Row>
            <Col xs={12} sm={4}>
              <strong>AWS Integration</strong><br/>
            </Col>
            <Col xs={12} sm={8}>
              <Link to="/start/launch-stack">Add Our Instance</Link>
            </Col>
          </Row>
        </td>
      </tr>
    );
  },
  renderCostEstimate(){
    const user = this.props.redux.user.toJS();
    const team = this.props.redux.team.toJS();
    if ((user.perms.admin || user.perms.billing) && team.subscription_quantity){
      let unit = 5;
      if (team.subscription_plan === 'team_monthly'){
        unit = 10;
      }
      return (
        <tr>
          <td colSpan={2}>
            <Row>
              <Col xs={12} sm={4}>
                <strong>Monthly Cost Estimate</strong><br/>
              </Col>
              <Col xs={12} sm={8}>
                {this.props.redux.checks.checks.size} checks at ${unit} per check = ${(unit * this.props.redux.checks.checks.size).toFixed(2)}
              </Col>
            </Row>
          </td>
        </tr>
      );
    }
    return null;
  },
  renderDefaultNotifications(){
    return (
      <tr>
        <td colSpan={2}>
          <Row>
            <Col xs={12} sm={4}>
              <strong>Default Check Notifications</strong>
            </Col>
            <Col xs={12} sm={8}>
              <Padding t={0.5}>
                <NotificationItemList notifications={this.props.redux.onboard.defaultNotifs} noError/>
              </Padding>
            </Col>
          </Row>
        </td>
      </tr>
    );
  },
  renderPermsIcons(member){
    const iconArr = _.chain(member)
    .get('perms')
    .pickBy(p => p)
    .keys()
    .map(key => {
      switch (key){
      case 'edit':
        return (
          <span title="Check Management">
            <Edit fill="text" className={style.permsIcon}/>
          </span>
        );
      case 'admin':
        return (
          <span title="Team Admin">
            <Key fill="text" className={style.permsIcon}/>
          </span>
        );
      case 'billing':
        return (
          <span title="Billing">
            <Docs fill="text" className={style.permsIcon}/>
          </span>
        );
      default:
        return null;
      }
    })
    .value();
    if (member.status === 'inactive'){
      return <span>&nbsp;(inactive)</span>;
    }
    return (
      <span className={style.permsIconsWrap}>{iconArr.map(i => i)}</span>
    );
  },
  renderMemberLink(member){
    const user = this.props.redux.user.toJS();
    if (member.id){
      return (
        <span>
          <Link to={user.email === member.email ? '/profile?ref=/team' : `/team/member/${member.id}`}>
            <strong>{member.name || member.email}</strong>
          </Link>
          {this.renderPermsIcons(member)}
        </span>
      );
    }
    return (
      <span>
        <strong>{member.email}</strong>{this.renderPermsIcons(member)}
      </span>
    );
  },
  renderShowAllButton(team){
    const members = this.getMembers(team);
    const diff = (team.users.length - members.length);
    if (diff > 0){
      return (
        <Padding b={1} l={1} t={1}>
          <a href="#" onClick={this.runShowAll}>Show {diff} hidden team member{diff > 1 && 's'}</a>
        </Padding>
      );
    }
    return null;
  },
  renderStatus(member){
    const user = this.props.redux.user.toJS();
    if (member.email === user.email){
      return '';
    }
    return member.status.match('invited|inactive') && ` (${member.status})`;
  },
  renderUserEditLink(member){
    const user = this.props.redux.user.toJS();
    if (member.email === user.email){
      return <Link to="/profile/edit?ref=/team" title="Edit Your Profile">Edit Your Profile</Link>;
    }
    if (member.id && user.perms.admin){
      return <Link to={`/team/member/${member.id}/edit?ref=/team`} title={`Edit ${member.name || member.email}`}>Edit</Link>;
    }
    if (member.status === 'invited'){
      return <span>{_.capitalize(member.status)}</span>;
    }
    return null;
  },
  render() {
    const team = this.getTeamData();
    const user = this.props.redux.user.toJS();
    if (this.props.redux.asyncActions.teamGet.history.length){
      return (
         <div>
          <Toolbar title={team.name && `Team ${team.name}` || 'Your Team'} pageTitle="Team"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <Panel>
                  <Heading level={3}>Your Profile</Heading>
                  <Table>
                    <tr>
                      <td colSpan={2}>
                        <Row>
                          <Col xs={12} sm={4}>
                            <strong>Email</strong><br/>
                          </Col>
                          <Col xs={12} sm={8}>
                            <Link to="/profile/edit?ref=/team">{user.email}</Link>
                          </Col>
                        </Row>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <Row>
                          <Col xs={12} sm={4}>
                            <strong>Password</strong><br/>
                          </Col>
                          <Col xs={12} sm={8}>
                            <Link to="/profile/edit?ref=/team" >Change Your Password</Link>
                          </Col>
                        </Row>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <Row>
                          <Col xs={12} sm={4}>
                            <strong>Color Scheme</strong><br/>
                          </Col>
                          <Col xs={12} sm={8}>
                            <SchemePicker/>
                          </Col>
                        </Row>
                      </td>
                    </tr>
                    {
                      // window.location.href.match('localhost|staging') && (
                      //   <tr>
                      //     <td><strong>Plan Features</strong></td>
                      //     <td>{toSentenceSerial(team.features)}</td>
                      //   </tr>
                      // )
                    }
                  </Table>
                  <Padding t={4}>
                    <Row>
                      <Col xs={6} sm={4}>
                        <Heading level={3}>Team Details</Heading>
                      </Col>
                      <Col xs={6} sm={8}>
                        {user.perms.admin && <Link to="/team/edit">Edit Team</Link>}
                      </Col>
                    </Row>
                    <Table>
                      <tr>
                        <td colSpan={2}>
                          <Row>
                            <Col xs={12} sm={4}>
                              <strong>Name</strong><br/>
                            </Col>
                            <Col xs={12} sm={8}>
                              <Link to="/team/edit">{team.name || '(No Team name set)'}</Link>
                            </Col>
                          </Row>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <Row>
                            <Col xs={12} sm={4}>
                              <strong>Subscription Plan</strong><br/>
                            </Col>
                            <Col xs={12} sm={8}>
                              <Link to="/team/edit">{this.getPlan(team)}</Link>
                            </Col>
                          </Row>
                        </td>
                      </tr>
                      {this.renderCostEstimate()}
                      {this.renderDefaultNotifications()}
                      {
                        // window.location.href.match('localhost|staging') && (
                        //   <tr>
                        //     <td><strong>Subscription Plan</strong></td>
                        //     <td>{team.plan}&nbsp;&nbsp;<Link to="/team/edit">Change Plan</Link></td>
                        //   </tr>
                        // )
                      }
                      {
                        // window.location.href.match('localhost|staging') && (
                        //   <tr>
                        //     <td><strong>Plan Features</strong></td>
                        //     <td>{toSentenceSerial(team.features)}</td>
                        //   </tr>
                        // )
                      }
                    </Table>
                  </Padding>
                  <Padding t={4}>
                    <Heading level={3}>Team Integrations</Heading>
                    <Table>
                      {this.renderAWSArea()}
                      {this.renderSlackArea()}
                      {this.renderPagerdutyArea()}
                    </Table>
                  </Padding>
                  <Padding t={4}>
                    <Heading level={3}>Team Members</Heading>
                    <Table>
                      {this.getMembers(team).map(member => {
                        return (
                          <tr>
                            <td>
                              {this.renderMemberLink(member)}
                            </td>
                            <td className="text-right">
                              {this.renderUserEditLink(member)}
                            </td>
                          </tr>
                        );
                      })}
                    </Table>
                    {this.renderShowAllButton(team)}
                    <Padding t={1}>
                      <Button to="/team/member/invite" color="success" flat><Add inline fill="success"/>Invite New Team Member</Button>
                    </Padding>
                  </Padding>
                  {
                    // window.location.href.match('localhost|staging') && (
                    //   <Padding t={3}>
                    //     <Heading level={3}>Team Billing</Heading>
                    //     <Padding b={1} l={1}>
                    //       MasterCard ****4040 4/2041&nbsp;&nbsp;<Link to="/team/edit">Edit Billing Information</Link>
                    //     </Padding>
                    //     <Table>
                    //       {_.sortBy(team.invoices, i => -1 * i.date).map(invoice => {
                    //         return (
                    //           <tr>
                    //             <td>
                    //               <strong>${invoice.amount.toFixed(2)}</strong> on {new Date(invoice.date).toDateString()}<br/>
                    //               <Color c="gray5"><small><TimeAgo date={invoice.date}/></small></Color>
                    //             </td>
                    //           </tr>
                    //         );
                    //       })}
                    //     </Table>
                    //   </Padding>
                    // )
                  }
                  <Padding t={3}>
                    <Button flat color="danger" onClick={this.props.userActions.logout}>
                      <Logout inline fill="danger"/> Log Out
                    </Button>
                  </Padding>
                </Panel>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }
    return null;
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  userActions: bindActionCreators(userActions, dispatch),
  onboardActions: bindActionCreators(onboardActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Profile);