import React, {PropTypes} from 'react';
import Loader from './Loader.jsx';
import {Alert} from '../../modules/bootstrap';
import _ from 'lodash';

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
    noFallback: PropTypes.bool
  },
  getInitialState(){
    return {
      error: (this.props.status && typeof this.props.status === 'object') || false,
      success: false,
      attempts: 0
    };
  },
  componentWillReceiveProps(nextProps){
    if (nextProps.status === 'success'){
      return this.setState({success: true, attempts: this.state.attempts + 1});
    }
    if (nextProps.status && typeof nextProps.status !== 'string'){
      let error = nextProps.status;
      if (error && error.req){
        error = error.text;
      }
      if (!error.message){
        error = error.toString();
      }
      this.setState({error});
    }
  },
  getErrorText(){
    if (_.get(this.state, 'error.message')){
      return this.state.error.message;
    }
    return this.props.errorText || 'Something went wrong.';
  },
  render(){
    if (this.props.status === 'pending' && this.state.attempts < 1){
      return <Loader timeout={this.props.timeout}/>;
    }else if (this.state.error){
      return (
        <Alert bsStyle="danger">{this.getErrorText()}</Alert>
      );
    }else if ((this.state.success || this.state.attempts > 0) && !this.props.noFallback){
      return (
        <div>{this.props.children}</div>
      );
    }
    return <div/>;
  }
});

export default StatusHandler;