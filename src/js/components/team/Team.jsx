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
  user as userActions
} from '../../actions';
import {SlackInfo, PagerdutyInfo} from '../integrations';
import style from './team.css';

const Profile = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getTeam: PropTypes.func
    }),
    userActions: PropTypes.shape({
      logout: PropTypes.func.isRequired
    }).isRequired,
    redux: PropTypes.shape({
      team: PropTypes.object.isRequired,
      user: PropTypes.object.isRequired,
      asyncActions: PropTypes.shape({
        teamGet: PropTypes.object
      }).isRequired,
      env: PropTypes.shape({
        activeBastion: PropTypes.object
      })
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object
    })
  },
  componentWillMount() {
    this.props.actions.getTeam();
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
          <td><strong>Slack</strong></td>
          <td className="text-right"><SlackInfo connect redirect={`${window.location.origin}/team?pagerduty=true`}/></td>
        </tr>
      );
    }
    return null;
  },
  renderPagerdutyArea(){
    if (flag('integrations-pagerduty')){
      return (
        <tr>
          <td><strong>PagerDuty</strong></td>
          <td className="text-right"><PagerdutyInfo redirect={`${window.location.origin}/team?pagerduty=true`}/></td>
        </tr>
      );
    }
    return null;
  },
  renderAWSArea(){
    if (!!this.props.redux.env.activeBastion){
      return (
        <tr>
          <td><strong>AWS Integration</strong></td>
          <td className="text-right"><Link to="/system">Enabled</Link></td>
        </tr>
      );
    }
    return (
      <tr>
        <td><strong>AWS Integration</strong></td>
        <td className="text-right"><Link to="/start/launch-stack">Add Our Instance</Link></td>
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
                      <td><strong>Email</strong></td>
                      <td className="text-right"><Link to="/profile/edit?ref=/team">{user.email}</Link></td>
                    </tr>
                    <tr>
                      <td><strong>Password</strong></td>
                      <td className="text-right"><Link to="/profile/edit?ref=/team" >Change Your Password</Link></td>
                    </tr>
                    <tr>
                      <td><strong>Color Scheme</strong></td>
                      <td className="text-right">
                        <SchemePicker/>
                      </td>
                    </tr>
                  </Table>
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
                  <Padding t={4}>
                    <Heading level={3}>Team Details</Heading>
                    <Table>
                      <tr>
                        <td><strong>Name</strong></td>
                        <td className="text-right">{team.name || '(No Team name set)'}&nbsp;&nbsp;
                        { user.perms.admin &&
                          (<Link to="/team/edit">Edit Team Name</Link>)
                        }
                        </td>
                      </tr>
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
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Profile);