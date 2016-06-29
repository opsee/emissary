import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import {StatusHandler, Table, Toolbar} from '../global';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import {Edit, Logout} from '../icons';
import {Color, Heading} from '../type';
import {PagerdutyInfo, SlackInfo} from '../integrations';
import {flag} from '../../modules';

import {
  user as actions,
  app as appActions,
  team as teamActions
} from '../../actions';

const Profile = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      logout: PropTypes.func,
      sendVerificationEmail: PropTypes.func
    }),
    teamActions: PropTypes.shape({
      getTeam: PropTypes.func.isRequired
    }).isRequired,
    appActions: PropTypes.shape({
      shutdown: PropTypes.func
    }),
    redux: PropTypes.shape({
      user: PropTypes.object,
      asyncActions: PropTypes.shape({
        userSendVerificationEmail: PropTypes.object,
        teamGet: PropTypes.object
      }),
      team: PropTypes.object.isRequired,
      env: PropTypes.object({
        activeBastion: PropTypes.object
      })
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object
    })
  },
  componentWillMount(){
    this.props.teamActions.getTeam();
  },
  getUser() {
    return this.props.redux.user.toJS();
  },
  isTeam(){
    return this.props.redux.team.users.size > 1;
  },
  handleLogout(){
    this.props.actions.logout();
  },
  handleTriggerEmail(e){
    e.preventDefault();
    const user = this.getUser();
    this.props.actions.sendVerificationEmail({ id: user.id });
  },
  renderVerificationNag(user){
    if (user.verified) {
      return null;
    }
    const { status } = this.props.redux.asyncActions.userSendVerificationEmail;
    switch (status) {
    case 'pending':
      return (
        <Color c="gray500">Sending verification email...</Color>
      );
    case 'success':
      return (
        <Color c="success">Verification email sent!</Color>
      );
    default:
      return (
        <span><a href="#" onClick={this.handleTriggerEmail}>Resend verification email</a></span>
      );
    }
  },
  renderEmail(user){
    if (user.verified) {
      return user.email;
    }
    return (
      <span>{user.email} <span className="text-sm"><Color c="danger">Unverified</Color></span></span>
    );
  },
  renderTeamInfo(){
    const team = this.props.redux.team.toJS();
    const name = team.name && team.name !== 'default' && team.name;
    return (
      <tr>
        <td><strong>Team</strong></td>
        <td><Link to={name && '/team' || '/team/create'}>{name || 'Invite Team Members'}</Link></td>
      </tr>
    );
  },
  renderAWSArea(){
    if (!this.isTeam()){
      if (!!this.props.redux.env.activeBastion){
        return (
          <tr>
            <td><strong>AWS Integration</strong></td>
            <td><Link to="/system">Enabled</Link></td>
          </tr>
        );
      }
      return (
        <tr>
          <td><strong>AWS Integration</strong></td>
          <td><Link to="/start/launch-stack">Add Our Instance</Link></td>
        </tr>
      );
    }
    return null;
  },
  renderSlackArea(){
    if (flag('integrations-slack') && !this.isTeam()){
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
    if (flag('integrations-pagerduty') && !this.isTeam()){
      return (
        <tr>
          <td><strong>PagerDuty</strong></td>
          <td><PagerdutyInfo/></td>
        </tr>
      );
    }
    return null;
  },
  renderIntegrations(){
    if (this.isTeam()){
      return (
        <tr>
          <td><strong>Integrations</strong></td>
          <td><Link to="/team">See Team Integrations</Link></td>
        </tr>
        );
    }
    return null;
  },
  renderVerified(){
    if (this.props.location.query.verified){
      return (
        <Padding b={2}>
          <Alert color="success">
            Your email has been successfully verified.
          </Alert>
        </Padding>
      );
    }
    return null;
  },
  render() {
    const user = this.getUser();
    return (
      <StatusHandler status={this.props.redux.asyncActions.teamGet.status}>
        <Toolbar title={user.name} pageTitle="Profile">
          <Button fab color="info" to="/profile/edit" title="Edit Your Profile">
            <Edit btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderVerified()}
              <Padding b={1}>
                <Heading level={3}>Your Profile</Heading>
                <Table>
                  {this.renderTeamInfo()}
                  <tr>
                    <td><strong>Email</strong></td>
                    <td>
                      <div>{this.renderEmail(user)}</div>
                      <div>{this.renderVerificationNag(user)}</div>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Password</strong></td>
                    <td><Link to="/profile/edit" >Change Your Password</Link></td>
                  </tr>
                  {this.renderAWSArea()}
                  {this.renderSlackArea()}
                  {this.renderPagerdutyArea()}
                  {this.renderIntegrations()}
                </Table>
              </Padding>
              <Padding t={3}>
                <Button flat color="danger" onClick={this.handleLogout}>
                  <Logout inline fill="danger"/> Log Out
                </Button>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </StatusHandler>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  appActions: bindActionCreators(appActions, dispatch),
  teamActions: bindActionCreators(teamActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Profile);