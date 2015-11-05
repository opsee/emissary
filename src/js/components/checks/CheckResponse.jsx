import React, {PropTypes} from 'react';
import {Alert} from '../../modules/bootstrap';
import _ from 'lodash';
import Highlight from '../global/Highlight.jsx';
import {CheckStore} from '../../stores';
import {CheckActions} from '../../actions';
import {ChevronUp, ChevronDown} from '../icons';
import {Button} from '../forms';
import style from './checkResponse.css';

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
  getResponseClass(){
    let c = {};
    if (this.state.expanded) {
      c = style.checkResponseExpanded;
    } else {
      c = style.checkResponse;
    }
    return c;
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
        <Button color="info" onClick={this.handleToggle} className={style.checkResponseButton} title="Close Reponse">
          <ChevronUp inline/>
        </Button>
      );
    }
    return (
      <Button color="info" onClick={this.handleToggle} className={style.checkResponseButton} title="Open Response">
        <ChevronDown inline/>
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
        <Alert type="danger">There was an error sending your request.</Alert>
      );
    }
    return (
      <div className={style.checkResponseWaiting}>Your response will appear here</div>
    );
  },
  render() {
    if (CheckStore.getResponse() && this.state.complete){
      if (this.getFormattedResponse() && this.getFormattedResponse().error){
        return (
          <div className={this.getResponseClass()}>
            <Alert type="info">{this.getFormattedResponse().error}</Alert>
          </div>
        );
      }
      return (
        <div className={this.getResponseClass()}>
          <Highlight>
            {JSON.stringify(_.get(this.getFormattedResponse(), 'response.value'), null, ' ')}
          </Highlight>
          {this.renderButton()}
        </div>
      );
    }
    return (
      <div className={this.getResponseClass()}>
        {this.renderWaitingResponse()}
      </div>
    );
  }
});

export default CheckResponse;