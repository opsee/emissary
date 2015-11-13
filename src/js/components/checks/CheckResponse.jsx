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
    check: PropTypes.object,
    response: PropTypes.object
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
    if (!this.props.response){
      const old = this.getArrayFromData(this.props.check);
      const data = this.getArrayFromData(nextProps.check);
      if (!_.isEqual(old, data)){
        this.runTestCheck(nextProps);
      }
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
    const data = this.props.response || CheckStore.getResponse();
    return CheckStore.getFormattedResponse(data);
  },
  getResponseClass(){
    return this.state.expanded ? style.checkResponseExpanded : style.checkResponse;
  },
  isCheckComplete(check){
    const condition1 = check.target.id;
    const condition2 = _.chain(['port', 'verb', 'path']).map(s => check.check_spec.value[s]).every().value();
    return condition1 && condition2;
  },
  runTestCheck(props){
    if (this.props.response){
      return this.setState({complete: true});
    }
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
        <div className={style.checkResponseWaiting}>Sending request...</div>
      );
    }else if (this.state.error){
      return (
        <Alert bsStyle="danger">There was an error sending your request.</Alert>
      );
    }
    return (
      <div className={style.checkResponseWaiting}>Your response will appear here</div>
    );
  },
  renderCode(){
    return (
      <div className={this.getResponseClass()}>
        <Highlight>
          {JSON.stringify(_.get(this.getFormattedResponse(), 'response.value'), null, ' ')}
        </Highlight>
        {this.renderButton()}
      </div>
    );
  },
  renderWaiting(){
    return (
      <div className={this.getResponseClass()}>
        {this.renderWaitingResponse()}
      </div>
    );
  },
  renderError(){
    return (
      <div className={style.checkResponseWaiting}>
        <Alert bsStyle="danger">{this.getFormattedResponse().error}</Alert>
      </div>
    );
  },
  render() {
    if (this.props.response && !this.props.response.size){
      return this.renderWaiting();
    }else if (this.props.response || (CheckStore.getResponse() && this.state.complete)){
      if (this.getFormattedResponse() && this.getFormattedResponse().error){
        return this.renderError();
      }
      return this.renderCode();
    }
    return this.renderWaiting();
  }
});

export default CheckResponse;