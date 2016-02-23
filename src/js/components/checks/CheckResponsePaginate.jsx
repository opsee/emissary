import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Alert} from '../../modules/bootstrap';
import {Highlight} from '../global';
import {Padding} from '../layout';
import {ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Refresh} from '../icons';
import {Button} from '../forms';
import style from './checkResponse.css';
import {checks as actions} from '../../actions';
import {ListCheckmark, ListClose} from '../icons';
import color from '../type/color.css';
import {Heading} from '../type';

const CheckResponsePaginate = React.createClass({
  propTypes: {
    check: PropTypes.object,
    responses: PropTypes.object,
    actions: PropTypes.shape({
      test: PropTypes.func,
      selectResponse: PropTypes.func
    }),
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        responses: PropTypes.object,
        responsesFormatted: PropTypes.array,
        selectedResponse: PropTypes.number
      }),
      asyncActions: PropTypes.shape({
        checkTest: PropTypes.object
      })
    }),
    showBoolArea: PropTypes.bool,
    showRerunButton: PropTypes.bool,
    /**
     * If true, the response body will be collapsed by default and can be
     * expanded with a button click. If false, the entire response body will
     * be shown, and the expansion button will be hidden.
     */
    allowCollapse: PropTypes.bool
  },
  getDefaultProps() {
    return {
      showBoolArea: true,
      showRerunButton: true,
      allowCollapse: true
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
    if (!this.props.responses){
      const old = this.getArrayFromData(this.props.check);
      const data = this.getArrayFromData(nextProps.check);
      if (!_.isEqual(old, data)){
        this.runTestCheck(nextProps);
      }
    }
  },
  getArrayFromData(data){
    if (!data){
      return [];
    }
    let arr = _.map(['protocol', 'port', 'verb', 'path', 'body'], s => data.check_spec.value[s]);
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
    return this.props.redux.checks.responsesFormatted;
  },
  getResponseClass(){
    const shouldExpand = !this.props.allowCollapse || this.state.expanded;
    return shouldExpand ? style.checkResponseExpanded : style.checkResponse;
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
  getResponses(){
    if (this.props.responses){
      return this.props.responses;
    }else if (this.state.complete){
      return this.props.redux.checks.responses;
    }
    return [];
  },
  isCheckComplete(check){
    if (!check){
      return false;
    }
    const condition1 = check.target.id;
    const condition2 = _.chain(['port', 'verb', 'path']).map(s => check.check_spec.value[s]).every().value();
    return condition1 && condition2;
  },
  isWaiting(){
    return this.getStatus() === 'pending';
  },
  runTestCheck(data = this.props){
    if (this.props.responses){
      return this.setState({complete: true});
    }
    const complete = this.isCheckComplete(data.check);
    if (complete){
      // if (this.getStatus() !== 'pending'){
      this.props.actions.test(data.check);
      // }
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
    if (!this.props.allowCollapse) {
      return null;
    }

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
    }else if (this.props.responses){
      return null;
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
    const res = this.getFormattedResponses()[this.props.redux.checks.selectedResponse];
    if (!res){
      return null;
    }
    if (res.error){
      return (
        <div className={style.checkResponseWaiting}>
          <Alert bsStyle="danger">{res.error}</Alert>
        </div>
      );
    }
    return (
      <div className={this.getResponseClass()}>
        <Highlight>
          {JSON.stringify(_.get(res, 'response.value'), null, ' ')}
        </Highlight>
        {this.renderButton()}
      </div>
    );
  },
  renderWaiting(){
    return (
      <div>
        {this.renderTitle()}
        <div className={this.getResponseClass()}>
          {this.renderWaitingResponse()}
        </div>
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
    const active = this.props.redux.checks.selectedResponse > 0;
    return <Button title="Previous Response" flat color="primary" onClick={this.runPrev} disabled={!active}><ChevronLeft fill={!active ? 'textSecondary' : 'primary'} inline/></Button>;
  },
  renderPassing(){
    const passing = this.getNumberPassing();
    if (passing){
      return (
        <span>
          <Padding r={1} inline>
            <ListCheckmark inline fill="success"/>&nbsp;{this.getNumberPassing()} Passing
          </Padding>
        </span>
      );
    }
    return null;
  },
  renderFailing(){
    const failing = this.getNumberFailing();
    if (failing){
      return (
        <span>
          <Padding r={1} inline>
            <ListClose inline fill="danger"/>&nbsp;{this.getNumberFailing()} Failing
          </Padding>
        </span>
      );
    }
    return null;
  },
  renderBoolArea(){
    if (this.props.showBoolArea){
      return (
        <div>
          <Padding b={1}>
            {this.renderPassing()}
            {this.renderFailing()}
          </Padding>
        </div>
      );
    }
    return null;
  },
  renderFlippers(){
    if (this.getResponses().size > 1){
      return (
        <Padding tb={1}>
          {this.renderPrevButton()}&nbsp;&nbsp;{this.renderNextButton()}
        </Padding>
      );
    }
    return null;
  },
  renderRerunButton() {
    if (!this.props.showRerunButton) {
      return null;
    }
    return <Button sm flat color="primary" onClick={this.runTestCheck} title="Re-run check request" style={{height: '3rem'}} disabled={this.getStatus() === 'pending'}><Refresh fill="primary"/></Button>;
  },
  renderTitle(){
    return (
      <Padding t={1} className="display-flex">
        <Heading level={3} className="flex-1">Response{this.getResponses().size > 1 ? 's' : ''}</Heading>
        {this.renderRerunButton()}
      </Padding>
    );
  },
  renderTopArea(){
    const arr = this.getFormattedResponses();
    if (arr.length){
      const passing = _.get(arr[this.props.redux.checks.selectedResponse], 'passing');
      if (!this.props.showBoolArea){
        return (
          <Padding a={0.5}>
          <strong>{_.get(arr[this.props.redux.checks.selectedResponse], 'target.id')}</strong> ({this.props.redux.checks.selectedResponse + 1} of {arr.length})
          </Padding>
        );
      }
      return (
        <Padding a={0.5}>
          <strong className={passing ? color.success : color.danger}>{_.get(arr[this.props.redux.checks.selectedResponse], 'target.id')}</strong> ({this.props.redux.checks.selectedResponse + 1} of {arr.length})
        </Padding>
      );
    }
    return null;
  },
  render() {
    if (this.props.responses && !this.props.responses.size){
      return null;
    } else if (this.isWaiting()){
      return this.renderWaiting();
    } else if (this.getResponses().size){
      return (
        <div>
        {this.renderTitle()}
        {this.renderBoolArea()}
          <div style={{background: '#212121'}}>
            <Padding a={0.5}>
              {this.renderTopArea()}
              {this.renderItem()}
            </Padding>
          </div>
          {this.renderFlippers()}
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