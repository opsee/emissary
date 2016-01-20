import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import _ from 'lodash';

export function auth(Component, adminRequired){
  const Authenticator = React.createClass({
    propTypes: {
      redux: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      pushState: PropTypes.func.isRequired
    },
    componentWillMount() {
      this.runCheckAuth();
    },
    componentWillReceiveProps() {
      this.runCheckAuth();
    },
    isAuthenticated(){
      let arr = [];
      if (adminRequired){
        arr.push(this.props.redux.user.get('admin_id') > 0);
      }
      arr.push(!!(this.props.redux.user.get('token')));
      return _.every(arr);
    },
    runCheckAuth() {
      const redirect = this.props.location.pathname;
      if (!this.isAuthenticated()) {
        this.props.pushState(null, `/login?redirect=${redirect}`);
      }
    },
    render() {
      if (this.isAuthenticated()){
        return <Component {...this.props}/>;
      }
      return null;
    }
  });
  return connect(null, {pushState})(Authenticator);
}