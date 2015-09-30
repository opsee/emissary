import React, {PropTypes} from 'react';
import router from '../../modules/router.js';
import {Link} from 'react-router';
import {Grid, Row, Col, Button} from '../../modules/bootstrap';
import _ from 'lodash';
import colors from 'seedling/colors';
import Highlight from '../global/Highlight.jsx';
import {CheckStore} from '../../stores';
import {CheckActions} from '../../actions';
import {ChevronUp, ChevronDown} from '../icons';

function getState(){
  return {
    status:CheckStore.getTestCheckStatus(),
    response:CheckStore.getResponse(),
    complete:false,
    expanded:false
  }
}

const CheckResponse = React.createClass({
  mixins:[CheckStore.mixin],
  storeDidChange(){
    let state = getState();
    this.setState(state);
  },
  propTypes:{
    check:PropTypes.object.isRequired
  },
  getInitialState() {
    return getState();
  },
  arrayFromData(data){
    let arr = _.map(['port', 'verb', 'path'], s => data.check_spec.value[s]);
    arr.push(_.get(data, 'target.id'));
    return arr;
  },
  componentWillReceiveProps(nextProps){
    const complete = this.checkIsComplete(nextProps);
    if(complete){
      const old = this.arrayFromData(this.props.check);
      const data = this.arrayFromData(nextProps.check);
      if(!_.isEqual(old,data)){
        // CheckActions.testCheck(nextProps.check);
      }
    }
    this.setState({complete});
  },
  getFormattedResponse(){
    return CheckStore.getFormattedResponse(this.state.response);
  },
  checkIsComplete(props){
    const condition1 = props.check.target.id;
    const condition2 = _.chain(['port', 'verb', 'path']).map(s => props.check.check_spec.value[s]).every().value();
    return condition1 && condition2;
  },
  toggle(){
    this.setState({expanded:!this.state.expanded});
  },
  getStyle(){
    return {
      height:this.state.expanded ? 'auto' : '130px',
      overflow:this.state.expanded ? 'visible' : 'hidden'
    }
  },
  getButton(){
    if(this.state.expanded){
      return(
        <Button bsStyle="info" bsSize="small" onClick={this.toggle} style={this.getButtonStyle()} title="Close Reponse">
          <ChevronUp/>
        </Button>
      )
    }else{
      return (
        <Button bsStyle="info" bsSize="small" onClick={this.toggle} style={this.getButtonStyle()} title="Open Response">
          <ChevronDown/>
        </Button>
        )
    }
  },
  getButtonStyle(){
    return {
      right:0,
      position:'absolute',
      bottom:0,
      zIndex:2
    }
  },
  render() {
    // if(this.state.response && this.state.complete){
    if(true){
      return(
        <div style={this.getStyle()} className={`check-response ${this.state.expanded ? 'expanded' : ''}`}>
          <Highlight>
            {JSON.stringify(this.getFormattedResponse(), null, ' ')}
          </Highlight>
          {this.getButton()}
        </div>
      )
    }else{
      return (
        <div>waiting</div>
      )
    }
  }
})

export default CheckResponse;