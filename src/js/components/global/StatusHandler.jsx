import React, {PropTypes} from 'react';
import Loader from './Loader.jsx';
import {Alert} from '../../modules/bootstrap';

const StatusHandler = React.createClass({
  propTypes: {
    successText: PropTypes.string,
    timeout: PropTypes.number,
    status: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    children: PropTypes.node
  },
  getInitialState(){
    return {
      error: false,
      success: false
    };
  },
  componentWillReceiveProps(nextProps){
    if (nextProps.status === 'success'){
      return this.setState({success: true});
    }
    if (nextProps.status && typeof nextProps.status !== 'string'){
      let error = nextProps.status;
      if (error && error.req){
        error = error.text;
      }
      error = error.toString();
      this.setState({error});
    }
  },
  getErrorText(){
    if (this.state.error && typeof this.state.error === 'object' && this.state.error.message){
      return this.state.error.message;
    }
    return 'Something went wrong.';
  },
  render(){
    if (this.props.status === 'pending'){
      return <Loader timeout={this.props.timeout}/>;
    }else if (this.state.success){
      return (
        <div>{this.props.children}</div>
      );
    }else if (this.state.error){
      return (
        <Alert bsStyle="danger">{this.getErrorText()}</Alert>
      );
    }
    return <div/>;
  }
});

export default StatusHandler;