import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {push} from 'redux-router';
import _ from 'lodash';

export function auth(Component, adminRequired){
  const Authenticator = React.createClass({
    propTypes: {
      redux: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      push: PropTypes.func.isRequired
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
        arr.push(this.props.redux.user.get('admin'));
      }
      arr.push(!!(this.props.redux.user.get('token')));
      return _.every(arr);
    },
    runCheckAuth() {
      const {location} = this.props;
      const redirect = `${location.pathname}${location.search}`;
      if (!this.isAuthenticated()) {
        this.props.push(`/login?redirect=${redirect}`);
      }
    },
    render() {
      if (this.isAuthenticated()){
        return <Component {...this.props}/>;
      }
      return null;
    }
  });
  return connect(null, {push})(Authenticator);
}