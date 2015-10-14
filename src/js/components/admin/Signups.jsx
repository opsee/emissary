import React from 'react';
import router from '../../modules/router';
import colors from 'seedling/colors';
import _ from 'lodash';

import {Toolbar} from '../global';
import {AdminActions, GlobalActions, UserActions} from '../../actions';
import {AdminStore} from '../../stores';
import {Link} from 'react-router';
import {Checkmark} from '../icons';
import TimeAgo from 'react-timeago';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';

function getState(){
  return {
    signups:getData(),
    approveStatus:AdminStore.getActivateSignupStatus()
  }
}

function getData(){
  const signups = AdminStore.getSignups().toJS();
  return _.chain(signups).map(s => {
    s.created_at = new Date(Date.parse(s.created_at));
    return s;
  }).sortBy(s => {
    return -1*s.created_at;
  }).value()
}

export default React.createClass({
  mixins: [AdminStore.mixin],
  storeDidChange() {
    const data = getState();
    console.log(data);
    this.setState(data);
    if(data.approveStatus == 'success'){
      AdminActions.adminGetSignups();
      GlobalActions.globalModalMessage({
        html:'User activated. Email sent.',
        style:'success'
      });
    }
  },
  getInitialState:getState,
  componentWillMount(){
    AdminActions.adminGetSignups()
  },
  stepSubmit(data){
    console.log('step submit', data);
  },
  isUnapprovedSignup(s){
    return !s.claimed && !s.activated;
  },
  isApprovedSignup(s){
    return s.activated && !s.claimed;
  },
  isUser(s){
    return s.claimed;
  },
  getUnapproved(){
    return _.filter(this.state.signups, this.isUnapprovedSignup);
  },
  getApproved(){
    return _.filter(this.state.signups, this.isApprovedSignup);
  },
  getUsers(){
    return _.filter(this.state.signups, this.isUser);
  },
  activateSignup:AdminActions.adminActivateSignup,
  ghostAccount(signup){
    UserActions.userLogOut();
    //revisit this, params isn't working so using query atm
    router.transitionTo('login', null, {as:signup.id});
  },
  outputCheckmark(signup){
    if(this.isUser(signup)){
      return <Checkmark fill={colors.success}/>
    }else{
      return <span/>
    }
  },
  outputButton(signup){
    if(this.isUnapprovedSignup(signup) || this.isApprovedSignup(signup)){
      const text = this.isUnapprovedSignup(signup) ? 'Activate' : 'Resend Activation Email';
      return (
        <Button flat={true} bsStyle="primary" onClick={this.activateSignup.bind(null, signup)}>{text}</Button>
      )
    }else{
      return(
        <Button flat={true} bsStyle="primary" onClick={this.ghostAccount.bind(null, signup)}>Ghost</Button>
      )
    }
  },
  output(signup){
    return (
      <Col xs={12} sm={6} className="padding-tb">
        <div className="bg-gray-900 md-shadow-bottom-z-1">
          <div className="padding">
            <h2 className="margin-none">
                {signup.name}
                {this.outputCheckmark(signup)}
            </h2>
            <div>
              <div><a href="mailto:{{::signup.email}}">{signup.email}</a></div>
              <span>#{signup.id} - <TimeAgo date={signup.created_at}/></span>
            </div>
          </div>
          <div>
            {this.outputButton(signup)}
          </div>
        </div>
      </Col>
    )
  },
  render() {
    return (
      <div>
        <Toolbar title="Signups"/>
        <Grid>
          <Col xs={12} display-flex>
            <Row>
              <h2 className="text-danger">Unapproved</h2>
              <div className="display-flex-sm flex-wrap">
                {this.getUnapproved().map(this.output)}
              </div>
            </Row>
            <Row>
              <h2 className="text-warning">Approved</h2>
              <div className="display-flex-sm flex-wrap">
                {this.getApproved().map(this.output)}
              </div>
            </Row>
            <Row>
              <h2 className="text-success">Users</h2>
              <div className="display-flex-sm flex-wrap">
                {this.getUsers().map(this.output)}
              </div>
            </Row>
          </Col>
        </Grid>
      </div>
    );
  }
});