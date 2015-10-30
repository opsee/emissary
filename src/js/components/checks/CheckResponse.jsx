import React, {PropTypes} from 'react';
import {Alert} from '../../modules/bootstrap';
import _ from 'lodash';
import Highlight from '../global/Highlight.jsx';
import {CheckStore} from '../../stores';
import {CheckActions} from '../../actions';
import {ChevronUp, ChevronDown} from '../icons';
import {Button} from '../forms';

function getState(){
  return {
    status: CheckStore.getTestCheckStatus(),
    response: CheckStore.getResponse()
  };
}

const CheckResponse = React.createClass({
  mixins: [CheckStore.mixin],
  propTypes: {
    check: PropTypes.object.isRequired
  },
  getInitialState() {
    return _.assign(getState(), {
      complete: false,
      expanded: false
    });
  },
  componentDidMount(){
    this.runTestCheck(this.props);
  },
  componentWillReceiveProps(nextProps){
    const old = this.getArrayFromData(this.props.check);
    const data = this.getArrayFromData(nextProps.check);
    if (!_.isEqual(old, data)){
      this.runTestCheck(nextProps);
    }
  },
  storeDidChange(){
    let state = getState();
    if (state.status && typeof state.status !== 'string'){
      state.error = true;
    }else if (state.status){
      state.error = false;
    }
    this.setState(state);
  },
  getArrayFromData(data){
    let arr = _.map(['port', 'verb', 'path'], s => data.check_spec.value[s]);
    arr.push(_.get(data, 'target.id'));
    let headers = _.get(data, 'check_spec.value.headers');
    if (headers){
      arr.push(headers.map(h => {
        return h.name + h.values.join(', ');
      }).join(':'));
    }
    return arr;
  },
  getFormattedResponse(){
    return CheckStore.getFormattedResponse(CheckStore.getResponse());
  },
  getStyle(){
    return {
      height: this.state.expanded ? 'auto' : '130px',
      overflow: this.state.expanded ? 'visible' : 'hidden'
    };
  },
  getButtonStyle(){
    return {
      right: 0,
      position: 'absolute',
      bottom: 0,
      zIndex: 2
    };
  },
  isCheckComplete(check){
    const condition1 = check.target.id;
    const condition2 = _.chain(['port', 'verb', 'path']).map(s => check.check_spec.value[s]).every().value();
    return condition1 && condition2;
  },
  runTestCheck(props){
    const complete = this.isCheckComplete(props.check);
    if (complete){
      if (this.state.status !== 'pending'){
        CheckActions.testCheck(props.check);
      }
    }
    this.setState({complete: true});
  },
  handleToggle(){
    this.setState({expanded: !this.state.expanded});
  },
  renderButton(){
    if (this.state.expanded){
      return (
        <Button color="info" sm onClick={this.handleToggle} style={this.getButtonStyle()} title="Close Reponse">
          <ChevronUp/>
        </Button>
      );
    }
    return (
      <Button color="info" sm onClick={this.handleToggle} style={this.getButtonStyle()} title="Open Response">
        <ChevronDown/>
      </Button>
    );
  },
  renderWaitingResponse(){
    if (this.state.status && this.state.status === 'pending'){
      return (
        <div>Sending request...</div>
      );
    }else if (this.state.error){
      return (
        <Alert bsStyle="danger">There was an error sending your request.</Alert>
      );
    }
    return (
      <div>Your response will appear here</div>
    );
  },
  render() {
    if (CheckStore.getResponse() && this.state.complete){
      if (this.getFormattedResponse() && this.getFormattedResponse().error){
        return (
          <div style={this.getStyle()} className={`check-response flex-vertical-align justify-content-center`}>
            <Alert bsStyle="info">{this.getFormattedResponse().error}</Alert>
          </div>
        );
      }
      return (
        <div style={this.getStyle()} className={`check-response ${this.state.expanded ? 'expanded' : ''}`}>
          <Highlight>
            {JSON.stringify(_.get(this.getFormattedResponse(), 'response.value'), null, ' ')}
          </Highlight>
          {this.renderButton()}
        </div>
      );
    }
    return (
      <div style={this.getStyle()} className={`check-response flex-vertical-align justify-content-center`}>
        {this.renderWaitingResponse()}
      </div>
    );
  }
});

export default CheckResponse;