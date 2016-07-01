import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import {Table, Toolbar} from '../global';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {Button} from '../forms';
import {Edit, Logout} from '../icons';
import {Color, Heading} from '../type';
import {flag} from '../../modules';
import {
  user as actions,
  app as appActions,
  integrations as integrationsActions
} from '../../actions';
import {SlackInfo, PagerdutyInfo} from '../integrations';

const Profile = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      logout: PropTypes.func,
      sendVerificationEmail: PropTypes.func
    }),
    appActions: PropTypes.shape({
      shutdown: PropTypes.func,
      setScheme: PropTypes.func
    }),
    redux: PropTypes.shape({
      user: PropTypes.object,
      asyncActions: PropTypes.shape({
        userSendVerificationEmail: PropTypes.object
      }),
      env: PropTypes.object({
        activeBastion: PropTypes.object
      })
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object
    }),
    integrationsActions: PropTypes.shape({
      getSlackInfo: PropTypes.func,
      getSlackChannels: PropTypes.func,
      getPagerdutyInfo: PropTypes.func
    })
  },
  componentWillMount() {
    if (!this.props.location.query.slack && flag('integrations-slack')){
      this.props.integrationsActions.getSlackInfo();
    }
    if (!this.props.location.query.pagerduty && flag('integrations-pagerduty')){
      this.props.integrationsActions.getPagerdutyInfo();
    }
  },
  getUser() {
    return this.props.redux.user.toJS();
  },
  handleLogout(){
    this.props.actions.logout();
  },
  handleTriggerEmail(e){
    e.preventDefault();
    const user = this.getUser();
    this.props.actions.sendVerificationEmail({ id: user.id });
  },
  handleSchemeClick(scheme){
    this.props.appActions.setScheme(scheme);
  },
  renderVerificationNag(){
    const user = this.getUser();
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
  renderEmail(){
    const user = this.getUser();
    if (user.verified) {
      return user.email;
    }
    return (
      <span>{user.email} <span className="text-sm"><Color c="danger">Unverified</Color></span></span>
    );
  },
  renderAWSArea(){
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
  renderThemes(){
    return (
      <tr>
        <td><strong>Color Scheme</strong></td>
        <td>
          <Padding inline r={1}>
            <Button onClick={this.handleSchemeClick.bind(null, 'dark')} color="black">Dark</Button>
          </Padding>
          <Button onClick={this.handleSchemeClick.bind(null, 'light')} style={{color: '#333', border: '2px solid #666', background: 'rgba(200, 200, 200, 1)'}}>Light</Button>
        </td>
      </tr>
    );
  },
  render() {
    const user = this.getUser();
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
                <Padding a={2}>
                  <Padding tb={1}>
                    <Heading level={3}>Your Profile Information</Heading>
                  </Padding>
                  <Table>
                    <tr>
                      <td><strong>Email</strong></td>
                      <td>
                        <div>{this.renderEmail()}</div>
                        <div>{this.renderVerificationNag()}</div>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Password</strong></td>
                      <td><Link to="/profile/edit" >Change Your Password</Link></td>
                    </tr>
                    {this.renderAWSArea()}
                    {this.renderSlackArea()}
                    {this.renderPagerdutyArea()}
                    {this.renderThemes()}
                  </Table>
                </Padding>
              </Panel>
              <Padding t={3}>
                <Button flat color="danger" onClick={this.handleLogout}>
                  <Logout inline fill="danger"/> Log Out
                </Button>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  appActions: bindActionCreators(appActions, dispatch),
  integrationsActions: bindActionCreators(integrationsActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Profile);