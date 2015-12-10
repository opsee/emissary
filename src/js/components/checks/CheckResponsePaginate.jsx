import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Alert} from '../../modules/bootstrap';
import Highlight from '../global/Highlight.jsx';
import {Padding} from '../layout';
import {ChevronUp, ChevronDown, ChevronLeft, ChevronRight} from '../icons';
import {Button} from '../forms';
import style from './checkResponse.css';
import {checks as actions} from '../../reduxactions';

const CheckResponsePaginate = React.createClass({
  propTypes: {
    check: PropTypes.object,
    response: PropTypes.object,
    actions: PropTypes.shape({
      test: PropTypes.func,
      selectResponse: PropTypes.func
    }),
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        response: PropTypes.object,
        responsesFormatted: PropTypes.array,
        selectedResponse: PropTypes.number
      }),
      asyncActions: PropTypes.shape({
        checkTest: PropTypes.object
      })
    }),
    showBoolArea: PropTypes.bool
  },
  getDefaultProps() {
    return {
      showBoolArea: true
    };
  },
  getInitialState() {
    return {
      complete: false,
      expanded: false,
      activeItem: 0
    };
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
    // if (this.props.response){
    //   return statics.getFormattedResponses(this.props.response);
    // }
    return this.props.redux.checks.responsesFormatted;
  },
  getResponseClass(){
    return this.state.expanded ? style.checkResponseExpanded : style.checkResponse;
  },
  getStatus(){
    return this.props.redux.asyncActions.checkTest.status;
  },
  getTotalNumberOfResponses(){
    return this.props.redux.checks.responsesFormatted.length;
  },
  getNumberPassing(){
    return _.filter(this.props.redux.checks.responsesFormatted, 'passing').length;
  },
  getNumberFailing(){
    return this.getTotalNumberOfResponses() - this.getNumberPassing();
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
      if (this.getStatus() !== 'pending'){
        this.props.actions.test(props.check);
      }
    }
    this.setState({complete: true});
  },
  runNext(){
    const activeItem = this.props.redux.checks.selectedResponse + 1;
    if (activeItem < this.getTotalNumberOfResponses()){
      this.props.actions.selectResponse(activeItem);
    }
  },
  runPrev(){
    const activeItem = this.props.redux.checks.selectedResponse - 1;
    if (activeItem > -1){
      this.props.actions.selectResponse(activeItem);
    }
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
  renderItem(){
    const arr = this.getFormattedResponses();
    const res = this.getFormattedResponses()[this.props.redux.checks.selectedResponse];
    if (res.error){
      return (
        <div className={style.checkResponseWaiting}>
          <Alert bsStyle="danger">{res.error}</Alert>
        </div>
      );
    }
    return (
      <div>
        <div style={{background: '#212121', padding: '8px'}}><strong>{_.get(arr[this.props.redux.checks.selectedResponse], 'target.id')}</strong> ({this.props.redux.checks.selectedResponse + 1} of {arr.length})</div>
        <div className={this.getResponseClass()}>
        <Highlight>
          {JSON.stringify(_.get(res, 'response.value'), null, ' ')}
        </Highlight>
        {this.renderButton()}
      </div>
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
        <Alert bsStyle="danger">{this.getFormattedResponses()[this.props.redux.checks.selectedResponse].error}</Alert>
      </div>
    );
  },
  renderNextButton(){
    const active = this.props.redux.checks.selectedResponse < this.getTotalNumberOfResponses() - 1;
    return <Button title="Next Response" flat color="primary" onClick={this.runNext} disabled={!active}><ChevronRight fill={!active ? 'textSecondary' : 'primary'} inline/></Button>;
  },
  renderPrevButton(){
    const active = this.props.redux.checks.selectedResponse === this.getTotalNumberOfResponses() - 1;
    return <Button title="Previous Response" flat color="primary" onClick={this.runPrev} disabled={!active}><ChevronLeft fill={!active ? 'textSecondary' : 'primary'} inline/></Button>;
  },
  renderBoolArea(){
    if (this.props.showBoolArea){
      const passing = this.getNumberPassing();
      const failing = this.getNumberFailing();
      return (
        <table>
          <tbody>
            <tr>
              <td>{passing ? `${this.getNumberPassing()} Passing` : ''}</td>
              <td>{failing ? `${this.getNumberFailing()} Failing` : ''}</td>
            </tr>
          </tbody>
        </table>
      );
    }
    return <div/>;
  },
  renderTopArea(){
    const arr = this.getFormattedResponses();
    if (arr.length){
      return (
        <div>
          {this.renderBoolArea()}
          <p>{_.get(arr[this.props.redux.checks.selectedResponse], 'target.id')}</p>
        </div>
      );
    }
    return <div/>;
  },
  render() {
    if (this.getStatus() === 'pending' || (this.props.response && !this.props.response.size)){
      return this.renderWaiting();
    }else if (this.props.response || (this.props.redux.checks.response && this.state.complete)){
      return (
        <div>
          {
            //{this.renderTopArea()}
          }
          {this.renderItem()}
          <Padding tb={1}>
            {this.renderPrevButton()}&nbsp;&nbsp;{this.renderNextButton()}
          </Padding>
          {
          //   this.getFormattedResponses().map(res => {
          //   return this.renderItem(res);
          // })
          }
        </div>
      );
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

export default connect(mapStateToProps, mapDispatchToProps)(CheckResponsePaginate);