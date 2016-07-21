import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {StatusHandler, Toolbar} from '../global';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {Button, PlanInputs, Input} from '../forms';
import {Heading} from '../type';
import {Close} from '../icons';
import {team as actions} from '../../actions';
import NotificationSelection from '../checks/NotificationSelection';

const TeamEdit = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      edit: PropTypes.func.isRequired,
      getTeam: PropTypes.func.isRequired
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        userEdit: PropTypes.object.isRequired,
        teamEdit: PropTypes.object.isRequired,
        onboardGetDefaultNotifs: PropTypes.object.isRequired
      }).isRequired,
      onboard: PropTypes.shape({
        defaultNotifs: PropTypes.array
      }),
      team: PropTypes.object
    })
  },
  getInitialState() {
    return _.assign({}, this.props.redux.team.toJS(), {
      //planinputs valid
      valid: false,
      notifications: []
    });
  },
  componentWillMount(){
    this.props.actions.getTeam();
  },
  componentWillReceiveProps(nextProps) {
    const nextTeam = this.getData(nextProps);
    const team = this.getData();
    if (!_.isEqual(nextTeam, team)){
      this.setState(nextTeam);
    }
  },
  getData(props = this.props){
    return props.redux.team.toJS();
  },
  getStatus(){
    return this.props.redux.asyncActions.teamEdit.status;
  },
  isDisabled(){
    return _.some([
      !(this.state.name),
      this.getStatus() === 'pending',
      !this.state.valid  
    ]);
  },
  handleUserData(data){
    const user = _.assign({}, this.state.user, data);
    this.setState({user});
  },
  handleChange(state){
    this.setState(state);
  },
  handleCreditCardChange(stripeToken){
    this.setState({
      stripeToken
    });
  },
  handleNotifChange(notifications){
    if (notifications &&  notifications.length){
      this.setState({
        notifications
      });
    }
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.actions.edit(this.state);
  },
  renderNotificationSelection(){
    if (this.props.redux.asyncActions.onboardGetDefaultNotifs.history.length && !this.isTeam()){
      return (
        <NotificationSelection onChange={this.onChange} notifications={this.props.redux.onboard.defaultNotifs} />
      );
    }
    return null;
  },
  renderCreditCard(){
    return null;
    // if (this.props.redux.user){
    //   return (
    //     <Padding t={2}>
    //       <Heading level={3}>Update Credit Card</Heading>
    //       <CreditCard onChange={this.handleCreditCardChange}/>
    //     </Padding>
    //   )
    // }
    // return null;
  },
  render() {
    return (
       <div>
        <Toolbar title="Edit Your Team" bg="info" btnPosition="midRight">
          <Button to="/team" icon flat>
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <Panel>
                <form onSubmit={this.handleSubmit}>
                  <Padding b={1}>
                    <Input onChange={this.handleChange} data={this.state} path="name" placeholder="Team Name" label="Team Name*"/>
                  </Padding>
                  <PlanInputs onChange={this.handleChange} selected={this.state.subscription_plan}/>
                  <Padding t={2}>
                      <Heading level={3}>Team Default Notifications</Heading>
                      <NotificationSelection onChange={this.handleNotifChange} notifications={this.props.redux.onboard.defaultNotifs} />
                    </Padding>
                  <Padding t={2}>
                  {this.renderCreditCard()}
                  <StatusHandler status={this.getStatus()}/>
                    <Button color="success" type="submit" block disabled={this.isDisabled()}>
                      {this.getStatus() === 'pending' ? 'Updating...' : 'Update'}
                    </Button>
                  </Padding>
                  {JSON.stringify(this.state)}
                </form>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(TeamEdit);