import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {is} from 'immutable';

import {StatusHandler, Toolbar} from '../global';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {Button, PlanInputs} from '../forms';
import {Heading} from '../type';
import UserInputs from './UserInputs.jsx';
import {Close} from '../icons';
import NotificationSelection from '../checks/NotificationSelection';
import {
  user as actions,
  onboard as onboardActions,
  team as teamActions
} from '../../actions';

const ProfileEdit = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      edit: PropTypes.func
    }),
    onboardActions: PropTypes.shape({
      getDefaultNotifications: PropTypes.func.isRequired
    }).isRequired,
    teamActions: PropTypes.shape({
      getTeam: PropTypes.func.isRequired
    }).isRequired,
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        userEdit: PropTypes.object.isRequired,
        onboardGetDefaultNotifs: PropTypes.object.isRequired,
        teamEdit: PropTypes.object.isRequired
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
    this.props.teamActions.getTeam();
  },
  getInitialState() {
    return _.assign({
      //planinputs is valid
      valid: false,
      subscription_plan: undefined
    }, this.props.redux.user.toJS());
  },
  componentWillReceiveProps(nextProps) {
    if (!is(nextProps.redux.team, this.props.redux.team)){
      this.setState(nextProps.redux.team.toJS());
    }
  },
  getStatus(str = 'user'){
    switch (str){
    case 'team':
      return this.props.redux.asyncActions.teamEdit.status;
    default:
      return this.props.redux.asyncActions.userEdit.status;
    }
  },
  isTeam(){
    return !!(this.props.redux.team.users.size > 1);
  },
  isDisabled(){
    return _.some([
      !(this.state.email && this.state.name),
      this.getStatus() === 'pending',
      !this.state.valid
    ]);
  },
  handleNotifChange(notifications){
    if (notifications &&  notifications.length){
      this.setState(_.assign(this.state, {notifications}));
    }
  },
  handleUserData(data){
    const state = _.assign({}, this.state, data);
    this.setState(state);
  },
  handleSubmit(e){
    e.preventDefault();
    const {props} = this;
    props.actions.edit(this.state, props.redux.team.toJS().users.length > 1 ? '/team' : '/profile');
  },
  handleChange(state){
    this.setState(state);
  },
  renderNotificationSelection(){
    if (this.props.redux.asyncActions.onboardGetDefaultNotifs.history.length && !this.isTeam()){
      return (
        <Padding t={3}>
          <Heading level={3}>Default Notifications</Heading>
          <NotificationSelection onChange={this.handleNotifChange} notifications={this.props.redux.onboard.defaultNotifs} />
        </Padding>
      );
    }
    return null;
  },
  renderPlanInputs(){
    if (!this.isTeam()){
      return (
        <Padding t={1} b={1}>
          <PlanInputs onChange={this.handleChange} selected={this.state.subscription_plan}/>
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
              <Panel>
                <form onSubmit={this.handleSubmit}>
                  <UserInputs include={['email', 'name', 'password']} onChange={this.handleUserData} data={this.state} required={['email', 'name']} password={{label: 'New Password', placeholder: '****'}}/>
                  {this.renderPlanInputs()}
                  {this.renderNotificationSelection()}
                  <StatusHandler status={this.getStatus()}/>
                  <StatusHandler status={this.getStatus('team')}/>
                  <Padding t={2}>
                    <Button color="success" type="submit" block disabled={this.isDisabled()}>
                      {this.getStatus() === 'pending' ? 'Updating...' : 'Update'}
                    </Button>
                  </Padding>
                  {
                    process.env.NODE_ENV === 'debug' && JSON.stringify(this.state)
                  }
                </form>
              </Panel>
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
  onboardActions: bindActionCreators(onboardActions, dispatch),
  teamActions: bindActionCreators(teamActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit);