import React from 'react';
import {Toolbar} from '../global';
import {AdminActions} from '../../actions';
import {AdminStore} from '../../stores';
import {Link} from 'react-router';
import _ from 'lodash';
import {Checkmark} from '../icons';
import colors from 'seedling/colors';
import TimeAgo from 'react-timeago';
import {Grid, Row, Col} from '../../modules/bootstrap';

function getSignups(){
  const signups = AdminStore.getSignups().toJS();
  return _.chain(signups).map(s => {
    s.created_at = new Date(Date.parse(s.created_at));
    return s;
  }).sortBy(s => {
    return -1*s.created_at;
  }).value()
}

function getState(){
  return {
    signups:getSignups()
  }
}

export default React.createClass({
  mixins: [AdminStore.mixin],
  storeDidChange() {
    this.setState(getState());
  },
  getInitialState:getState,
  getData(){
    AdminActions.getSignups()
  },
  componentWillMount(){
    this.getData();
  },
  stepSubmit(data){
    console.log('step submit', data);
  },
  updateData(data){
    let obj = _.assign(this.state.check, data);
    this.setState({
      check:obj
    });
  },
  isUnapprovedSignup(s){
    return !s.activation_id;
  },
  isApprovedSignup(s){
    return !!s.activation_id && !s.activation_used;
  },
  isUser(s){
    return !!s.activation_id && s.activation_used;
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
  activateSignup:AdminActions.activateSignup,
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
        <button type="button" className="btn btn-flat btn-primary" onClick={this.activateSignup.bind(null, signup)}>{text}</button>
      )
    }else{
      return <span/>;
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
          <Row>
            <h2 className="text-danger">Unapproved</h2>
            {this.getUnapproved().map(this.output)}
          </Row>
          <Row>
            <h2 className="text-warning">Approved</h2>
            {this.getApproved().map(this.output)}
          </Row>
          <Row>
            <h2 className="text-success">Users</h2>
            {this.getUsers().map(this.output)}
          </Row>
        </Grid>
      </div>
    );
  }
});