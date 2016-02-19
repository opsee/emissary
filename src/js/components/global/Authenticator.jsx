import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import _ from 'lodash';

const Authenticator = React.createClass({
  propTypes: {
    admin: PropTypes.bool,
    children: PropTypes.node,
    pushState: PropTypes.func.isRequired,
    redux: PropTypes.object.isRequired,
    inverse: PropTypes.bool
  },
  componentWillMount() {
    this.runCheckAuth();
  },
  componentWillReceiveProps() {
    this.runCheckAuth();
  },
  isAuthenticated(){
    let arr = [];
    if (this.props.admin){
      arr.push(this.props.redux.user.get('admin'));
    }
    arr.push(!!(this.props.redux.user.get('token')));
    const bool = _.every(arr);
    return this.props.inverse ? !bool : bool;
  },
  runCheckAuth() {
    const redirect = this.props.redux.router.location.pathname;
    if (!this.isAuthenticated()) {
      this.props.pushState(null, `/login?redirect=${redirect}`);
    }
  },
  renderInner(){
    return React.Children.map(this.props.children, c => {
      return React.cloneElement(c, {redux: this.props.redux});
    });
  },
  render() {
    if (this.isAuthenticated()){
      return (
        <div>
          {this.renderInner()}
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