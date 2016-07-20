import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {StatusHandler, Toolbar} from '../global';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {Button} from '../forms';
import {Heading} from '../type';
import UserInputs from './UserInputs.jsx';
import {Close} from '../icons';
import NotificationSelection from '../checks/NotificationSelection';
import {
  user as actions,
  onboard as onboardActions
} from '../../actions';

const ProfileEdit = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      edit: PropTypes.func
    }),
    onboardActions: PropTypes.shape({
      getDefaultNotifications: PropTypes.func.isRequired
    }).isRequired,
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        userEdit: PropTypes.object,
        onboardGetDefaultNotifs: PropTypes.object.isRequired
      }).isRequired,
      user: PropTypes.object,
      team: PropTypes.object,
      onboard: PropTypes.shape({
        defaultNotifs: PropTypes.array
      })
    }),
    location: PropTypes.shape({
      query: PropTypes.object.isRequired
    }).isRequired
  },
  componentWillMount() {
    this.props.onboardActions.getDefaultNotifications();
  },
  getInitialState() {
    return {
      user: this.props.redux.user.toJS()
    };
  },
  getStatus(){
    return this.props.redux.asyncActions.userEdit.status;
  },
  isTeam(){
    return !!(this.props.redux.team.users.size > 1);
  },
  isDisabled(){
    return !(this.state.user.email && this.state.user.name) ||
    this.getStatus() === 'pending';
  },
  handleNotifChange(notifications){
    if (notifications &&  notifications.length){
      this.setState({
        user: _.assign(this.state.user, {notifications})
      });
    }
  },
  handleUserData(data){
    const user = _.assign({}, this.state.user, data);
    this.setState({user});
  },
  handleSubmit(e){
    e.preventDefault();
    const {props} = this;
    props.actions.edit(this.state.user, props.redux.team.toJS().users.length > 1 ? '/team' : '/profile');
  },
  renderNotificationSelection(){
    if (this.props.redux.asyncActions.onboardGetDefaultNotifs.history.length && !this.isTeam()){
      return (
        <Padding t={1}>
          <Heading level={3}>Default Notifications</Heading>
          <NotificationSelection onChange={this.handleNotifChange} notifications={this.props.redux.onboard.defaultNotifs} />
        </Padding>
      );
    }
    return null;
  },
  render() {
    const to = this.props.location.query.ref || '/profile';
    return (
       <div>
        <Toolbar title="Edit Your Profile" bg="info" btnPosition="midRight">
          <Button to={to} icon flat>
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding t={1}>
                <Panel>
                  <form onSubmit={this.handleSubmit}>
                    <UserInputs include={['email', 'name', 'password']} onChange={this.handleUserData} data={this.state.user} required={['email', 'name']}/>
                    {this.renderNotificationSelection()}
                    <StatusHandler status={this.getStatus()}/>
                    <Padding t={2}>
                      <Button color="success" type="submit" block disabled={this.isDisabled()}>
                        {this.getStatus() === 'pending' ? 'Updating...' : 'Update'}
                      </Button>
                    </Padding>
                  </form>
                </Panel>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  onboardActions: bindActionCreators(onboardActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit);