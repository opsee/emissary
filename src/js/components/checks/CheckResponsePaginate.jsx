import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import cx from 'classnames';

import TimeAgo from 'react-timeago';
import {Link} from 'react-router';

import {Alert, Padding} from '../layout';
import {ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Refresh} from '../icons';
import {Button} from '../forms';
import style from './checkResponse.css';
import {checks as actions} from '../../actions';
import {ListCheckmark, ListClose} from '../icons';
import {Color, Heading} from '../type';
import CheckResponseSingle from './CheckResponseSingle';
import {bastions} from '../../modules';

const CheckResponsePaginate = React.createClass({
  propTypes: {
    check: PropTypes.object,
    responses: PropTypes.object,
    scheme: PropTypes.string,
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
    allowCollapse: PropTypes.bool,
    date: PropTypes.instanceOf(Date)
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
      expanded: !this.props.allowCollapse,
      activeItem: 0,
      debouncedTestAction: _.debounce(this.props.actions.test, 500)
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
        this.props.actions.selectResponse(0);
      }
    }
  },
  getArrayFromData(data){
    if (!data){
      return [];
    }
    let arr = _.map(['protocol', 'port', 'verb', 'path', 'body'], s => data.spec[s]);
    arr.push(_.get(data, 'target.id'));
    arr.push(_.get(data, 'target.service'));
    arr.push(_.get(data, 'target.container'));
    arr.push(_.get(data, 'target.containerPort'));
    let headers = _.get(data, 'spec.headers');
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
  getCheckStatus(){
    let status = null;
    if (this.props.showBoolArea){
      const arr = this.getFormattedResponses();
      const selected = arr[this.props.redux.checks.selectedResponse];
      status = _.get(selected, 'passing') ? 'passing' : 'failing';
    }
    return status;
  },
  getResponseClass(waiting){
    return cx(
      style.item,
      this.state.expanded && style.expanded,
      style[this.getCheckStatus()],
      style[this.props.scheme],
      (this.isWaiting() || waiting) && style.waiting
    );
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
    } else if (this.state.complete){
      return this.props.redux.checks.responses;
    }
    return [];
  },
  getBody(){
    return _.get(this.getFormattedResponses()[this.props.redux.checks.selectedResponse], 'response.body');
  },
  getCurrentResponseTargetLink(target = {}){
    const {type, id} = target;
    switch (type){
    case 'instance':
      return `/instance/ecc/${id}`;
    case 'external_host':
      return `http://${id}`;
    default:
      return '';
    }
  },
  isCheckComplete(check){
    if (!check){
      return false;
    }
    const condition1 = check.target.id;
    const condition2 = _.chain(['port', 'verb', 'path']).map(s => check.spec[s]).every().value();
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
      this.state.debouncedTestAction(data.check);
    }
    return this.setState({complete: true});
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
        <Button color="info" onClick={this.handleToggle} className={cx(style.button, style[this.props.scheme])} title="Close Reponse">
          <ChevronUp inline fill="white"/>
        </Button>
      );
    }
    return (
      <Button color="info" onClick={this.handleToggle} className={cx(style.button, style[this.props.scheme])} title="Open Response">
        <ChevronDown inline fill="white"/>
      </Button>
    );
  },
  renderWaitingResponse(){
    if (this.getStatus() === 'pending'){
      return (
        <div className={this.getResponseClass(true)}>Sending request...</div>
      );
    } else if (this.getStatus() && typeof this.getStatus() !== 'string'){
      return (
        <Alert color="danger" className="flex-1">There was an error sending your request.</Alert>
      );
    } else if (this.props.responses){
      return null;
    }
    return (
      <div className={this.getResponseClass(true)}>
        <div>Your response will appear here</div>
      </div>
    );
  },
  renderHeaders(res){
    const headers = _.get(res, 'response.headers') || {};
    return (
      <div>
        {_.chain(headers).keys().map(key => {
          return (
            <div>
              <code style={{fontSize: '1.4rem'}}>{key}:&nbsp;<Color c="primary">{headers[key]}</Color></code>
            </div>
          );
        }).value()}
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
        <Padding className={this.getResponseClass(true)} a={1}>
          <div style={{width: '100%'}}>
            {this.renderTopArea()}
          </div>
          <Alert color="danger" className="flex-1">{res.error}</Alert>
        </Padding>
      );
    }
    return (
      <Padding a={1} className={this.getResponseClass()}>
        <div style={{width: '100%'}}>
          <div>
            {this.renderTopArea()}
          </div>
          <CheckResponseSingle code={_.get(res, 'response.code')} headers={_.get(res, 'response.headers') || {}} body={this.getBody()} metrics={_.get(res, 'response.metrics')}/>
        </div>
        {this.renderButton()}
      </Padding>
    );
  },
  renderWaiting(){
    return (
      <div>
        {this.renderTitle()}
        {this.renderWaitingResponse()}
      </div>
    );
  },
  renderError(){
    return (
      <div className={this.getResponseClass(true)}>
        <Alert color="danger" className="flex-1">{this.getFormattedResponses()[this.props.redux.checks.selectedResponse].error}</Alert>
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
        <Padding r={1} inline>
          <ListCheckmark inline fill="success"/>&nbsp;{this.getNumberPassing()} Passing
        </Padding>
      );
    }
    return null;
  },
  renderFailing(){
    const failing = this.getNumberFailing();
    if (failing){
      return (
        <Padding r={1} inline>
          <ListClose inline fill="danger"/>&nbsp;{this.getNumberFailing()} Failing
        </Padding>
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
            {this.renderDate()}
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
    const disabled = this.getStatus() === 'pending';
    return (
      <Button sm flat color="primary" onClick={this.runTestCheck} title="Re-run check request" style={{height: '3rem'}} disabled={disabled}>
        <Refresh fill={disabled ? 'textSecondary' : 'primary'}/>
      </Button>
    );
  },
  renderTitle(){
    return (
      <Padding t={1} className="display-flex">
        <Heading level={3} className="flex-1">Response{this.getResponses().size > 1 ? 's' : ''}</Heading>
        {this.renderRerunButton()}
      </Padding>
    );
  },
  renderDate(){
    if (this.props.date instanceof Date){
      const s = this.props.date.toString();
      return (
        <Color c="gray5">
          <small title="The date this event was processed.">{`- ${s}`}&nbsp;-&nbsp;<TimeAgo date={this.props.date}/></small>
        </Color>
      );
    }
    return null;
  },
  renderTopArea(){
    const arr = this.getFormattedResponses();
    const selected = arr[this.props.redux.checks.selectedResponse];
    const id = _.get(selected, 'target.id');
    const address = _.get(selected, 'target.address');
    let title = id || address;
    if ((id && address) && id !== address){
      title = `${id} - ${address}`;
    }
    let region = bastions[selected.bastion_id] || null;
    region = region ? ` - ${region}` : null;
    if (arr.length){
      const link = this.getCurrentResponseTargetLink(_.get(selected, 'target'));
      let responseTitle = null;
      if (link.match('http')){
        responseTitle = <strong><a href={link} target="_blank">{title}</a>{region}</strong>;
      } else if (link){
        responseTitle = <strong><Link to={link}>{title}</Link>{region}</strong>;
      }
      return (
        <div>
          ({this.props.redux.checks.selectedResponse + 1} of {arr.length})&nbsp;{responseTitle}
        </div>
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
          <div>
            {this.renderItem()}
          </div>
          {this.renderFlippers()}
        </div>
      );
    }
    return this.renderWaiting();
  }
});

const mapStateToProps = (state) => ({
  redux: state,
  scheme: state.app.scheme
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckResponsePaginate);