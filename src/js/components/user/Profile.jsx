import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import _ from 'lodash';

import {SchemePicker, StatusHandler, Table, Toolbar} from '../global';
import {Alert, Col, Grid, Padding, Panel, Row} from '../layout';
import {Button} from '../forms';
import {Edit, Logout} from '../icons';
import {Color, Heading} from '../type';
import {PagerdutyInfo, SlackInfo} from '../integrations';
import {flag} from '../../modules';
import {NotificationItemList} from '../checks';
import PlanInfo from '../team/PlanInfo';

import {
  user as actions,
  team as teamActions,
  onboard as onboardActions
} from '../../actions';

const Profile = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      logout: PropTypes.func,
      sendVerificationEmail: PropTypes.func
    }),
    onboardActions: PropTypes.shape({
      getDefaultNotifications: PropTypes.func.isRequired
    }).isRequired,
    teamActions: PropTypes.shape({
      getTeam: PropTypes.func.isRequired
    }).isRequired,
    redux: PropTypes.shape({
      user: PropTypes.object,
      asyncActions: PropTypes.shape({
        userSendVerificationEmail: PropTypes.object,
        teamGet: PropTypes.object
      }),
      team: PropTypes.object.isRequired,
      env: PropTypes.object({
        activeBastion: PropTypes.object
      }),
      onboard: PropTypes.shape({
        defaultNotifs: PropTypes.array.isRequired
      }).isRequired,
      checks: PropTypes.shape({
        checks: PropTypes.object
      }).isRequired
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object
    })
  },
  componentWillMount(){
    this.props.teamActions.getTeam();
    this.props.onboardActions.getDefaultNotifications();
  },
  getUser() {
    return this.props.redux.user.toJS();
  },
  getPlan(team){
    let plan = team.subscription_plan;
    if (plan === 'beta'){
      plan = 'Team (beta)';
    }
    return _.capitalize(plan);
  },
  isTeam(){
    return !!(this.props.redux.team.users.size > 1);
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
        <Color c="gray5">Sending verification email...</Color>
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
    if (flag('team')){
      return (
        <tr>
          <td colSpan={2}>
            <Row>
              <Col xs={12} sm={4}>
                <strong>Team</strong><br/>
              </Col>
              <Col xs={12} sm={8}>
                <Link to={name && '/team' || '/team/create'}>{name || 'Invite Team Members'}</Link>
              </Col>
            </Row>
          </td>
        </tr>
      );
    }
    return null;
  },
  renderPlan(team = this.props.redux.team.toJS()){
    if (!this.isTeam()){
      return (
        <tr>
          <td colSpan={2}>
            <Row>
              <Col xs={12} sm={4}>
                <strong>Subscription Plan</strong><br/>
              </Col>
              <Col xs={12} sm={8}>
                <Link to="/profile/edit">{this.getPlan(team)}</Link>
              </Col>
            </Row>
          </td>
        </tr>
      );
    }
    return null;
  },
  renderBilling(){
    if (!this.isTeam() && this.props.redux.team.get('subscription_status') === 'active'){
      return (
        <tr>
          <td><strong>Billing</strong></td>
          <td><Link to="/profile/edit">Master Card ****4555</Link></td>
        </tr>
      );
    }
    return null;
  },
  renderCostEstimate(){
    if (!this.isTeam()){
      const team = this.props.redux.team.toJS();
      if (team.subscription_quantity){
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
    }
    return null;
  },
  renderAWSArea(){
    if (!this.isTeam()){
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
    }
    return null;
  },
  renderSlackArea(){
    if (flag('integrations-slack') && !this.isTeam()){
      return (
        <tr>
          <td colSpan={2}>
            <Row>
              <Col xs={12} sm={4}>
                <strong>Slack</strong>
              </Col>
              <Col xs={12} sm={8}>
                <SlackInfo connect redirect={this.isTeam() && `${window.location.origin}/team?slack=true` || undefined}/>
              </Col>
            </Row>
          </td>
        </tr>
      );
    }
    return null;
  },
  renderPagerdutyArea(){
    if (flag('integrations-pagerduty') && !this.isTeam()){
      return (
        <tr>
          <td colSpan={2}>
            <Row>
              <Col xs={12} sm={4}>
                <strong>PagerDuty</strong><br/>
              </Col>
              <Col xs={12} sm={8}>
                <PagerdutyInfo redirect={this.isTeam() && `${window.location.origin}/team?pagerduty=true` || null}/>
              </Col>
            </Row>
          </td>
        </tr>
      );
    }
    return null;
  },
  renderThemes(){
    return (
      <tr>
        <td><strong>Color Scheme</strong></td>
        <td>
          <SchemePicker/>
        </td>
      </tr>
    );
  },
  renderIntegrations(){
    if (!this.isTeam()){
      return (
        <Padding t={3}>
          <Heading level={3}>Integrations</Heading>
          <Table>
            {this.renderAWSArea()}
            {this.renderSlackArea()}
            {this.renderPagerdutyArea()}
          </Table>
        </Padding>
      );
    }
    return (
      <Padding t={3}>
        <Heading level={3}>Integrations</Heading>
        <Table>
          <tr>
            <td colSpan={2}>
              <Row>
                <Col xs={12} sm={4}>
                  <strong>Integrations</strong><br/>
                </Col>
                <Col xs={12} sm={8}>
                  <Link to="/team">See Team Integrations</Link>
                </Col>
              </Row>
            </td>
          </tr>
        </Table>
      </Padding>
    );
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
  renderDefaultNotifications(){
    if (!this.isTeam()){
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
    }
    return null;
  },
  render() {
    const user = this.getUser();
    if (this.props.redux.asyncActions.teamGet.history.length){
      return (
        <div>
          <Toolbar title={user.name} pageTitle="Profile">
            <Button fab color="info" to="/profile/edit" title="Edit Your Profile">
              <Edit btn/>
            </Button>
          </Toolbar>
          <Grid>
            <Row>
              <Col xs={12}>
                <Panel>
                  {this.renderVerified()}
                  <Padding b={1}>
                    <Heading level={3}>Your Profile</Heading>
                    <Table>
                      {this.renderTeamInfo()}
                      <tr>
                        <td colSpan={2}>
                          <Row>
                            <Col xs={12} sm={4}>
                              <strong>Email</strong><br/>
                            </Col>
                            <Col xs={12} sm={8}>
                              <div>{this.renderEmail(user)}</div>
                              <div>{this.renderVerificationNag(user)}</div>
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
                              <Link to="/profile/edit" >Change Your Password</Link>
                            </Col>
                          </Row>
                        </td>
                      </tr>
                    </Table>
                    <PlanInfo base="profile"/>
                    {this.renderIntegrations()}
                    <Padding t={3}>
                      <Table>
                        {this.renderDefaultNotifications()}
                      </Table>
                    </Padding>
                  </Padding>
                  <Padding t={3}>
                    <Button flat color="danger" onClick={this.handleLogout}>
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
    return <StatusHandler status={this.props.redux.asyncActions.teamGet.status}/>;
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  teamActions: bindActionCreators(teamActions, dispatch),
  onboardActions: bindActionCreators(onboardActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Profile);