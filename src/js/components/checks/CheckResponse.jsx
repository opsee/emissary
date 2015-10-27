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
    status: CheckStore.getTestCheckStatus()
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
    this.fire(this.props);
  },
  componentWillReceiveProps(nextProps){
    const old = this.getArrayFromData(this.props.check);
    const data = this.getArrayFromData(nextProps.check);
    if (!_.isEqual(old, data)){
      this.fire(nextProps);
    }
  },
  storeDidChange(){
    let state = getState();
    if (state.status && typeof state.status != 'string'){
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
        return h.name+h.values.join(', ');
      }).join(':'));
    }
    return arr;
  },
  fire(props){
    const complete = this.checkIsComplete(props.check);
    if (complete){
      if (this.state.status != 'pending'){
        CheckActions.testCheck(props.check);
      }
    }
    this.setState({complete: true});
  },
  getFormattedResponse(){
    return CheckStore.getFormattedResponse(CheckStore.getResponse());
  },
  checkIsComplete(check){
    const condition1 = check.target.id;
    const condition2 = _.chain(['port', 'verb', 'path']).map(s => check.check_spec.value[s]).every().value();
    return condition1 && condition2;
  },
  toggle(){
    this.setState({expanded:!this.state.expanded});
  },
  getStyle(){
    return {
      height: this.state.expanded ? 'auto' : '130px',
      overflow: this.state.expanded ? 'visible' : 'hidden'
    }
  },
  getButton(){
    if (this.state.expanded){
      return (
        <Button color="info" bsSize="small" onClick={this.toggle} style={this.getButtonStyle()} title="Close Reponse">
          <ChevronUp/>
        </Button>
      )
    }else {
      return (
        <Button color="info" bsSize="small" onClick={this.toggle} style={this.getButtonStyle()} title="Open Response">
          <ChevronDown/>
        </Button>
        )
    }
  },
  getButtonStyle(){
    return {
      right: 0,
      position: 'absolute',
      bottom: 0,
      zIndex: 2
    }
  },
  renderWaitingResponse(){
    if (this.state.status && this.state.status == 'pending'){
      return (
        <div>Sending request...</div>  
      )
    }else if (this.state.error){
      return (
        <Alert bsStyle="danger">There was an error sending your request.</Alert>
      )
    }else {
      return (
        <div>Your response will appear here</div>  
      )
    }
  },
  render() {
    if (CheckStore.getResponse() && this.state.complete){
      return (
        <div style={this.getStyle()} className={`check-response ${this.state.expanded ? 'expanded' : ''}`}>
          <Highlight>
            {JSON.stringify(this.getFormattedResponse(), null, ' ')}
          </Highlight>
          {this.getButton()}
        </div>
      )
    }else {
      return (
        <div style={this.getStyle()} className={`check-response flex-vertical-align justify-content-center`}>
          {this.renderWaitingResponse()}
        </div>
      )
    }
  }
})

export default CheckResponse;