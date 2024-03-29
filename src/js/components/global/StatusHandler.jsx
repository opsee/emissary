import React, {PropTypes} from 'react';
import _ from 'lodash';

import Loader from './Loader';
import {Alert, Padding} from '../layout';

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
    history: PropTypes.array,
    waitingText: PropTypes.string,
    persistent: PropTypes.bool
  },
  getDefaultProps() {
    return {
      history: [],
      persistent: false
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
    let arr = [];
    arr.push(!_.isEqual(this.props.status, nextProps.status) || !_.isEqual(this.state, nextState));
    arr.push(!_.isEqual(this.props.children, nextProps.children));
    return _.some(arr);
  },
  getErrorText(){
    let string = _.get(this.props, 'status.response.body.message') ||
    _.get(this.props, 'status.message') ||
    this.props.errorText;
    if (string.match('^Parser is unable')){
      string = _.get(this.props, 'status.rawResponse');
    }
    if (string.match('desc = ')){
      let split = string.split('desc = ');
      let last = _.last(split);
      if (last && last.length){
        string = last;
      } else {
        string = undefined;
      }
    }
    return string || this.props.errorText || 'Something went wrong.';
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
      return null;
    }
    if (this.props.status === 'pending' && (this.state.attempts < 1 || this.props.persistent)){
      if (this.props.waitingText){
        return (
          <div>
            <Padding b={1}>{this.props.waitingText}</Padding>
             <Loader timeout={this.props.timeout}/>
          </div>
        );
      }
      return <Loader timeout={this.props.timeout}/>;
    } else if (this.isError()){
      return (
        <Padding b={1}>
          <Alert color="danger" onDismiss={this.handleDismiss}>
            <div dangerouslySetInnerHTML={{__html: this.getErrorText()}}/>
          </Alert>
        </Padding>
      );
    } else if ((this.props.status === 'success' || this.state.attempts > 0) && !this.props.noFallback){
      return (
        <div>{this.props.children}</div>
      );
    }
    return null;
  }
});

export default StatusHandler;