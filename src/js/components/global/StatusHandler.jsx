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
      PropTypes.object,
    ]),
    children: PropTypes.node,
    noFallback: PropTypes.bool,
    onDismiss: PropTypes.func
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
      return this.setState({
        success: true, 
        attempts: this.state.attempts + 1,
        error: false
      });
    }
    if (nextProps.status && typeof nextProps.status !== 'string'){
      let error = nextProps.status;
      this.setState({error});
    }
  },
  getErrorText(){
    let text = 'Something went wrong';
    text = _.get(this.state.error, 'response.body.message') || text;
    return text;
  },
  handleDismiss(){
    if(this.props.onDismiss){
      this.props.onDismiss.call(this);
    }
    this.setState({
      error:false
    });
  },
  render(){
    if (this.props.status === 'pending' && this.state.attempts < 1){
      return <Loader timeout={this.props.timeout}/>;
    }else if (this.state.error){
      return (
        <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
          <div dangerouslySetInnerHTML={{__html: this.getErrorText()}}/>
        </Alert>
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