import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import _ from 'lodash';

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
    if (this.props.adminRequired){
      arr.push(this.props.redux.user.get('admin'));
    }
    arr.push(!!(this.props.redux.user.get('token')));
    return _.every(arr);
  },
  runCheckAuth() {
    const redirect = this.props.redux.router.location.pathname;
    if (!this.isAuthenticated()) {
      this.props.pushState(null, `/login?redirect=${redirect}`);
    }
  },
  render() {
    if (this.isAuthenticated()){
      return (
        <div>
          {this.props.children}
        </div>
      );
    }
    return null;
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps, {pushState})(Authenticator);