import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Alert} from '../../modules/bootstrap';
import Loader from './Loader';
import Padding from '../layout/Padding';

const StatusHandler = React.createClass({
  propTypes: {
    successText: PropTypes.string,
    errorText: PropTypes.string,
    timeout: PropTypes.number,
    status: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    children: PropTypes.node,
    noFallback: PropTypes.bool,
    onDismiss: PropTypes.func,
    history: PropTypes.array
  },
  getDefaultProps() {
    return {
      history: []
    };
  },
  getInitialState(){
    return {
      error: (this.props.status && typeof this.props.status === 'object') || false,
      success: false,
      attempts: this.props.history.length
    };
  },
  componentWillReceiveProps(nextProps){
    let state = {};
    if (this.props.status !== nextProps.status){
      state.dismissed = false;
      if (nextProps.status === 'success'){
        state.attempts = this.state.attempts + 1;
      }
    }
    this.setState(state);
  },
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props.status, nextProps.status) || !_.isEqual(this.state, nextState);
  },
  getErrorText(){
    return _.get(this.props, 'status.message') ||
    _.get(this.props, 'status.response.body.message') ||
    this.props.errorText ||
    'Something went wrong.';
  },
  isError(){
    return !!(this.props.status && typeof this.props.status !== 'string');
  },
  handleDismiss(){
    if (this.props.onDismiss){
      this.props.onDismiss.call(this);
    }
    this.setState({
      dismissed: true
    });
  },
  render(){
    if (this.state.dismissed){
      return <div/>;
    }
    if (this.props.status === 'pending' && this.state.attempts < 1){
      return <Loader timeout={this.props.timeout}/>;
    }else if (this.isError()){
      return (
        <Padding b={1}>
          <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
            <div dangerouslySetInnerHTML={{__html: this.getErrorText()}}/>
          </Alert>
        </Padding>
      );
    }else if ((this.props.status === 'success' || this.state.attempts > 0) && !this.props.noFallback){
      return (
        <div>{this.props.children}</div>
      );
    }
    return <div/>;
  }
});

export default StatusHandler;