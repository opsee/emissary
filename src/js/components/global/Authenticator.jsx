import config from '../../modules/config';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';

export function auth(Component){
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
      if (config.screenshotMode) {
        return true;
      }

      return !!(this.props.redux.user.get('token'));
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
      return <div/>;
    }
  });
  return connect(null, {pushState})(Authenticator);
}
