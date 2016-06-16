import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import {Table, Toolbar} from '../global';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import {Edit, Logout} from '../icons';
import {Color, Heading} from '../type';

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
        userSendVerificationEmail: PropTypes.object
      }),
      team: PropTypes.object.isRequired
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
  handleLogout(){
    this.props.actions.logout();
  },
  handleTriggerEmail(e){
    e.preventDefault();
    const user = this.getUser();
    this.props.actions.sendVerificationEmail({ id: user.id });
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
  renderEmail(){
    const user = this.getUser();
    if (user.verified) {
      return user.email;
    }
    return (
      <span>{user.email} <span className="text-sm"><Color c="danger">Unverified</Color></span></span>
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
              <Padding b={1}>
                <Heading level={3}>Your Profile</Heading>
                <Table>
                  <tr>
                    <td><strong>Team</strong></td>
                    <td><Link to="/team">{this.props.redux.team.get('name')}</Link></td>
                  </tr>
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
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  appActions: bindActionCreators(appActions, dispatch),
  teamActions: bindActionCreators(teamActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Profile);