import React from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';

export function auth(Component){
  const Authenticator = React.createClass({
    componentWillMount () {
      this.checkAuth();
    },
    componentWillReceiveProps (nextProps) {
      this.checkAuth();
    },
    isAuthenticated(){
      return !!(this.props.redux.user.get('token'));
    },
    checkAuth () {
      const redirect = this.props.location.pathname;
      if (!this.isAuthenticated()) {
        this.props.dispatch(pushState(null, `/login?redirect=${redirect}`));
      }
    },
    render () {
      if(this.isAuthenticated()){
        return <Component {...this.props}/>
      }
      return <div/>;
    }
  });
  return connect(null, {pushState})(Authenticator);
}