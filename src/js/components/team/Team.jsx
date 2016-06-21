import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import _ from 'lodash';

import {Table, Toolbar} from '../global';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import {Add, Logout} from '../icons';
import {Color, Heading} from '../type';
import {flag} from '../../modules';
import {permsSentence} from '../../modules/string';
import {
  team as actions,
  user as userActions
} from '../../actions';
import {SlackInfo, PagerdutyInfo} from '../integrations';

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
      }).isRequired
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
      start: {}
    };
  },
  getTeamData(){
    return this.props.redux.team.toJS();
  },
  renderSlackArea(){
    if (flag('integrations-slack')){
      return (
        <tr>
          <td><strong>Slack</strong></td>
          <td><SlackInfo connect/></td>
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
          <td><PagerdutyInfo/></td>
        </tr>
      );
    }
    return null;
  },
  renderMemberLink(member){
    const user = this.props.redux.user.toJS();
    if (member.id){
      return (
        <span>
          <Link to={user.email === member.email ? '/profile' : `/team/member/${member.id}`}>
            <strong>{member.name || member.email}</strong>
          </Link>&nbsp;
        </span>
      );
    }
    return (
      <span>
        <strong>{member.email}</strong>&nbsp;
      </span>
    );
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
      return <Link to="/profile/edit" title="Edit Your Profile">Edit Your Profile</Link>;
    }
    if (member.id){
      return <Link to={`/team/member/${member.id}/edit`} title={`Edit ${member.name || member.email}`}>Edit</Link>;
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
                <Heading level={3}>Your Profile</Heading>
                <Table>
                  <tr>
                    <td><strong>Email</strong></td>
                    <td><Link to="/profile/edit">{user.email}</Link></td>
                  </tr>
                  <tr>
                    <td><strong>Password</strong></td>
                    <td><Link to="/profile/edit" >Change Your Password</Link></td>
                  </tr>
                </Table>
                <Padding t={2}>
                  <Heading level={3}>Team Integrations</Heading>
                  <Table>
                    {this.renderSlackArea()}
                    {this.renderPagerdutyArea()}
                  </Table>
                </Padding>
                <Padding t={3}>
                  <Heading level={3}>Team Members</Heading>
                  <Table>
                    {_.sortBy(team.users, member => {
                      if (member.email === user.email){
                        return 'aaaaa';
                      }
                      return member.email;
                    }).map(member => {
                      return (
                        <tr>
                          <td>
                            {this.renderMemberLink(member)}
                            {this.renderStatus(member)}
                            <br/>
                            <Color c="gray6"><em>{permsSentence(member)}</em></Color>
                          </td>
                          <td style={{textAlign: 'right'}}>
                            {this.renderUserEditLink(member)}
                          </td>
                        </tr>
                      );
                    })}
                  </Table>
                  <Padding t={1}>
                    <Button to="/team/member/invite" color="success" flat><Add inline fill="success"/>Invite New Team Member</Button>
                  </Padding>
                </Padding>
                <Padding t={3}>
                  <Heading level={3}>Team Details</Heading>
                  <Table>
                    <tr>
                      <td><strong>Name</strong></td>
                      <td>{team.name || '(No Team name set)'}&nbsp;&nbsp;<Link to="/team/edit">Edit Team Name</Link></td>
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