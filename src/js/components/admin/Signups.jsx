import React from 'react';
import Toolbar from '../global/Toolbar.jsx';
import Actions from '../../actions/Admin';
import Store from '../../stores/Admin';
import Link from 'react-router/lib/components/Link';
import Router from 'react-router';
const RouteHandler = Router.RouteHandler;
import _ from 'lodash';
import {Checkmark} from '../icons/Module.jsx';
import colors from 'seedling/colors';
import TimeAgo from 'react-timeago';

function getSignups(){
  const signups = Store.getSignups().toJS();
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
  mixins: [Store.mixin],
  storeDidChange() {
    this.setState(getState());
  },
  getInitialState:getState,
  getData(){
    Actions.getSignups()
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
  submit(){
    console.log(this.state.check);
  },
  getUnapproved(){
    return _.filter(this.state.signups, s => !s.activation_id);
  },
  getApproved(){
    return _.filter(this.state.signups, s => !!s.activation_id && !s.activation_used);
  },
  getUsers(){
    return _.filter(this.state.signups, s => !!s.activation_id && s.activation_used);
  },
  activateSignup:Actions.activateSignup,
  outputCheckmark(signup){
    if(signup.activation_used){
      return <Checkmark fill={colors.success}/>
    }else{
      return <span/>
    }
  },
  outputButton(signup){
    if(!signup.activation_id){
      return (
        <button type="button" className="btn btn-flat btn-primary" onClick={this.activateSignup.bind(null, signup)}>Activate User</button>
      )
    }else{
      return <span/>;
    }
  },
  output(signup){
    return (
      <div className="col-xs-12 col-sm-6 padding-tb">
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
      </div>
    )
  },
  render() {
    return (
      <div>
        <Toolbar title="Signups"/>
        <div className="container">
          <div className="row">
            <h2 className="text-danger">Unapproved</h2>
            {this.getUnapproved().map(this.output)}
          </div>
          <div className="row">
            <h2 className="text-warning">Approved</h2>
            {this.getApproved().map(this.output)}
          </div>
          <div className="row">
            <h2 className="text-success">Users</h2>
            {this.getUsers().map(this.output)}
          </div>
        </div>
      </div>
    );
  }
});