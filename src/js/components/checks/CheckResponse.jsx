import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Alert} from '../../modules/bootstrap';
import Highlight from '../global/Highlight.jsx';
import {ChevronUp, ChevronDown} from '../icons';
import {Button} from '../forms';
import style from './checkResponse.css';
import {checks as actions} from '../../reduxactions';
import {statics} from '../../reducers/checks';

const CheckResponse = React.createClass({
  propTypes: {
    check: PropTypes.object,
    responses: PropTypes.object,
    actions: PropTypes.shape({
      test: PropTypes.func
    }),
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        responses: PropTypes.object,
        responsesFormatted: PropTypes.object
      }),
      asyncActions: PropTypes.shape({
        checkTest: PropTypes.object
      })
    })
  },
  getInitialState() {
    return {
      complete: false,
      expanded: false
    };
  },
  componentDidMount(){
    this.runTestCheck(this.props);
  },
  componentWillReceiveProps(nextProps){
    if (!this.props.responses){
      const old = this.getArrayFromData(this.props.check);
      const data = this.getArrayFromData(nextProps.check);
      if (!_.isEqual(old, data)){
        this.runTestCheck(nextProps);
      }
    }
  },
  getArrayFromData(data){
    let arr = _.map(['port', 'verb', 'path', 'body'], s => data.check_spec.value[s]);
    arr.push(_.get(data, 'target.id'));
    let headers = _.get(data, 'check_spec.value.headers');
    if (headers){
      arr.push(headers.map(h => {
        return h.name + h.values.join(', ');
      }).join(':'));
    }
    return arr;
  },
  getFormattedResponses(){
    if (this.props.responses){
      return statics.getFormattedResponses(this.props.responses);
    }
    return this.props.redux.checks.responsesFormatted;
  },
  getResponseClass(){
    return this.state.expanded ? style.checkResponseExpanded : style.checkResponse;
  },
  getStatus(){
    return this.props.redux.asyncActions.checkTest.status;
  },
  isCheckComplete(check){
    const condition1 = check.target.id;
    const condition2 = _.chain(['port', 'verb', 'path']).map(s => check.check_spec.value[s]).every().value();
    return condition1 && condition2;
  },
  runTestCheck(props){
    if (this.props.responses){
      return this.setState({complete: true});
    }
    const complete = this.isCheckComplete(props.check);
    if (complete){
      if (this.getStatus() !== 'pending'){
        this.props.actions.test(props.check);
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
    if (this.getStatus() === 'pending'){
      return (
        <div className={style.checkResponseWaiting}>Sending request...</div>
      );
    }else if (this.getStatus() && typeof this.getStatus() !== 'string'){
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
          {JSON.stringify(_.get(this.getFormattedResponses(), 'response.value'), null, ' ')}
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
        <Alert bsStyle="danger">{this.getFormattedResponses().error}</Alert>
      </div>
    );
  },
  render() {
    if (this.getStatus() === 'pending'){
      return this.renderWaiting();
    }
    if (this.props.responses && !this.props.responses.size){
      return this.renderWaiting();
    }else if (this.props.responses || (this.props.redux.checks.responses && this.state.complete)){
      if (this.getFormattedResponses() && this.getFormattedResponses().error){
        return this.renderError();
      }
      return this.renderCode();
    }
    return this.renderWaiting();
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckResponse);