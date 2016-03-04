import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {BoundField, Button} from '../forms';
import {Add, Checkmark, ChevronRight, Delete} from '../icons';
import {Padding} from '../layout';
import {Color, Heading} from '../type';
import {Alert} from '../../modules/bootstrap';
import {SlackConnect} from '../integrations';
import {flag, validate} from '../../modules';
import style from './assertionSelection.css';
import relationships from 'slate/src/relationships';
import types from 'slate/src/types';
import slate from 'slate';
import {
  integrations as actions
} from '../../actions';

const CodeForm = forms.Form.extend({
  operand: forms.CharField({
    label: 'Value',
    widgetAttrs: {
      noLabel: true
    }
  })
});

const HeaderForm = forms.Form.extend({
  operand: forms.CharField({
    label: 'Value',
    widgetAttrs: {
      noLabel: true
    }
  })
});

const BodyForm = forms.Form.extend({
  operand: forms.CharField({
    label: 'Value'
  }),
  value: forms.CharField({
    label: 'Value'
  })
});

const AssertionsSelection = React.createClass({
  propTypes: {
    check: PropTypes.object,
    assertions: PropTypes.array,
    response: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    redux: PropTypes.shape({
      user: PropTypes.object,
      integrations: PropTypes.shape({
        slackChannels: PropTypes.object,
        tests: PropTypes.array
      }).isRequired,
      asyncActions: PropTypes.shape({
        checkCreate: PropTypes.object
      })
    })
  },
  getDefaultProps() {
    return {
      assertions: [],
      response: {
        code: undefined,
        headers: [],
        body: undefined
      }
    };
  },
  getInitialState() {
    return {
      assertions: []
    };
  },
  componentDidMount(){
    if (this.props.assertions.length){
      const assertions = this.props.assertions.map((n, i) => {
        return this.getNewSchema(n.key, i);
      });
      this.runChange(assertions);
    }
  },
  getNewSchema(key, assertionIndex, value){
    const self = this;
    const opts = {
      onChange(){
        self.handleInputChange(this.cleanedData, assertionIndex);
        self.forceUpdate();
      },
      labelSuffix: '',
      prefix: `assertion-${assertionIndex}`,
      validation: {
        on: 'blur change',
        onChangeDelay: 300
      },
      initial: value ? {
        text: value
      } : {}
    };
    let form = new CodeForm(opts);
    switch (key){
      case 'header':
        form = new HeaderForm(opts);
        break;
      case 'body':
        form = new BodyForm(opts);
      break;
      default:
        break;
    }
    return {
      key,
      relationship: null,
      value,
      operand: null,
      form
    };
  },
  getAssertionValueForDisplay(assertion = {}){
    if (assertion.type === 'slack_bot'){
      const channels = this.props.redux.integrations.slackChannels.toJS();
      return _.chain(channels).find(c => c.id === assertion.value).get('name').value();
    }
    return assertion.value;
  },
  getFinalAssertions(assertions = this.state.assertions){
    return assertions.map(n => _.pick(n, ['key', 'value', 'relationship', 'operand']));
  },
  getResponse(){
    const {checks} = this.props.redux;
    const data = checks.responses.toJS()[checks.selectedResponse];
    if (data && data.response){
      return _.get(data, 'response.value');
    }
    return {};
  },
  getResponseFormatted(){
    const {checks} = this.props.redux;
    const data = checks.responsesFormatted[checks.selectedResponse];
    if (data && data.response){
      return _.get(data, 'response.value');
    }
    return {};
  },
  getSlateTest(assertion){
    let response = this.getResponse();
    response.body = typeof response.body === 'object' ? JSON.stringify(response.body) : response.body;
    if (response && response.body && validate.assertion(assertion)){
      return slate.checkAssertion(assertion, response);
    }
    return null;
  },
  getJsonPath(assertion){
    let path;
    if (assertion.json){
      let body = _.get(this.getResponse(), 'body') || {};
      if (typeof body === 'string'){
        try {
          body = JSON.parse(body);
        } catch (err){
          return path;
        }
      }
      body = typeof body === 'object' ? body : {};
      try {
        path = _.get(body, assertion.json);
        if (typeof path !== 'string'){
          path = JSON.stringify(path);
        }
      } catch (err){
        return path;
      }
    }
    return path;
  },
  getAlertStyle(assertion){
    let alertStyle = 'default';
    let test = this.getSlateTest(assertion);
    if (test && test.success){
      alertStyle = 'success';
    } else if (test){
      alertStyle = 'danger';
    }
    return alertStyle;
  },
  runSetAssertionsState(iteratee){
    const assertions = this.state.assertions.map(iteratee);
    this.setState({
      assertions
    });
    return assertions;
  },
  runChange(assertions = this.state.assertions){
    this.setState({
      assertions
    });
    this.props.onChange(this.getFinalAssertions(assertions));
  },
  runSetType(index, type){
    this.runSetAssertionsState((n, i) => {
      return _.assign({}, n, {
        type: index === i ? type : n.type
      });
    });
  },
  runSetValue(index, data, e){
    if (e){
      e.preventDefault();
    }
    const assertions = this.runSetAssertionsState((n, i) => {
      const value = data || n.valueState;
      return _.assign({}, n, {
        value: index === i ? value : n.value
      });
    }, true);
    this.props.onChange(this.getFinalAssertions(assertions));
  },
  runRemoveType(index){
    this.runSetAssertionsState((n, i) => {
      return _.assign({}, n, {
        type: index === i ? undefined : n.type
      });
    });
  },
  runNewAssertion(key, value){
    const assertions = this.state.assertions.concat([
      this.getNewSchema(key, this.state.assertions.length, value)
    ]);
    this.runChange(assertions);
  },
  runDelete(index){
    const assertions = _.reject(this.state.assertions, (n, i) => i === index);
    this.runChange(assertions);
  },
  runTestAssertion(assertion){
    this.props.actions.testAssertionication(_.pick(assertion, ['type', 'value']));
    const assertions = this.state.assertions.map(n => {
      return _.assign({}, n, {
        sending: n.type === assertion.type && n.value === assertion.value
      });
    });
    this.runChange(assertions);
  },
  runSetAssertionData(index, data){
    const assertions = this.state.assertions.map((assertion, i) => {
      const d = index === i ? data : {};
      return _.assign(assertion, d);
    });
    return this.runChange(assertions);
  },
  handleInputChange(data, index){
    const assertions = this.runSetAssertionsState((assertion, i) => {
      const d = index === i ? data : {};
      return _.assign(assertion, d);
    });
    this.props.onChange(this.getFinalAssertions(assertions));
  },
  handleSubmit(e){
    e.preventDefault();
    return false;
  },
  renderValueOrChannels(form){
    if (form.cleanedData.type === 'email'){
      return <BoundField bf={form.boundField('value')}/>;
    }
    return <BoundField bf={form.boundField('channel')}/>;
  },
  renderAssertionIcon(assertion, props = {}){
    const {type} = assertion;
    let el = <Mail {...props}/>;
    if (type === 'slack_bot' || type === 'slack'){
      el = <Slack {...props}/>;
    } else if (type === 'webhook'){
      el = <Cloud {...props}/>;
    }
    return (
      <span title={assertion.type}>{el}</span>
    );
  },
  renderDeleteButton(index){
    return (
      <Button flat color="danger" title="Remove this Assertion" onClick={this.runDelete.bind(null, index)} style={{minHeight: '46px', marginLeft: '1rem', marginTop: '3.2rem'}}>
        <Delete inline fill="danger"/>
      </Button>
    );
  },
  renderTextAssertion(assertion, index){
    return (
      <div className={style.line}>
        <Padding b={1} className={`display-flex ${style.inputArea}`}>
          <form name={`assertion-email-form-${index}`} onSubmit={this.handleSubmit} className="flex-1">
            {assertion.form.render()}
          </form>
          <Padding l={1} className="align-self-end">
            {this.renderDeleteButton(index)}
          </Padding>
        </Padding>
      </div>
    );
  },
  renderChosenChannel(assertion, index){
    return (
      <div>
        <Heading level={4}>Slack Channel</Heading>
        <div className="display-flex flex-vertical-align">
          <div className="flex-1">
            <div className="display-flex">
              {this.renderAssertionIcon(assertion)}&nbsp;{this.getAssertionValueForDisplay(assertion)}
            </div>
          </div>
          {this.renderDeleteButton(index)}
          {this.renderTestButton(assertion)}
        </div>
      </div>
    );
  },
  renderRelationshipButtons(assertionIndex){
    return (
      <Padding t={1} style={{width: '100%'}}>
        {relationships.map(rel => {
          const data = {
            relationship: rel.id
          };
          return (
            <Button flat onClick={this.runSetAssertionData.bind(null, assertionIndex, data)} color="text" style={{margin: '0 .5rem 1rem'}} key={`assertion-${assertionIndex}-relationship-${rel.id}`}>{rel.name}</Button>
          );
        })}
      </Padding>
    );
  },
  renderChosenRelationship(assertionIndex){
    const assertion = this.state.assertions[assertionIndex];
    if (assertion.relationship){
      const obj = _.find(relationships, {id: assertion.relationship}) || {};
      return (
        <Padding inline l={1}>
          <Button flat color="text" onClick={this.runSetAssertionData.bind(null, assertionIndex, {relationship: null})}>{obj.name}</Button>
        </Padding>
      );  
    }
    return null;
  },
  renderOperand(assertionIndex){
    const assertion = this.state.assertions[assertionIndex];
    if (assertion.relationship && !assertion.relationship.match('empty|notEmpty')){
      return (
        <Padding l={1} className="flex-1">
          <BoundField bf={this.state.assertions[assertionIndex].form.boundField('operand')}/>
        </Padding>
      );
    }
    return null;
  },
  renderCode(assertionIndex){
    const assertion = this.state.assertions[assertionIndex];
    const title = <Heading level={4}>Response Code</Heading>;
    let buttons = null;
    if (!assertion.relationship){
      buttons = this.renderRelationshipButtons(assertionIndex);
    }
    return (
      <div>
        {title}
        <Alert bsStyle={this.getAlertStyle(assertion)} className="display-flex flex-wrap flex-vertical-align" style={{padding:'.7rem 1rem', minHeight: '5.9rem'}}>
          <code style={{fontSize: '1.4rem'}}>{this.getResponse().code}</code>{this.renderChosenRelationship(assertionIndex)}{this.renderOperand(assertionIndex)}
        </Alert>
        {buttons}
      </div>
    );
  },
  renderHeader(assertionIndex){
    const assertion = this.state.assertions[assertionIndex];
    const selectedHeader = assertion.value;
    const selectedHeaderResult = _.get(this.getResponseFormatted(), `headers.${assertion.value}`);
    const headers = _.get(this.getResponseFormatted(), 'headers') || {};
    const headerKeys = _.keys(headers);
    let buttons = null;
    if (!assertion.relationship && assertion.value){
      buttons = this.renderRelationshipButtons(assertionIndex);
    } else if (!assertion.value){
      buttons = (
        <Padding t={1}>
          {headerKeys.map(key => {
            return (
              <Button flat nocap onClick={this.runSetAssertionData.bind(null, assertionIndex, {value: key})} color="text" style={{margin: '0 .5rem 1rem'}} key={`assertion-${assertionIndex}-header-key-${key}`}>{key}</Button>
            );
          })}
        </Padding>
      )
    }
    const title = <Heading level={4}>Header{selectedHeader ? ` - ${selectedHeader}` : null}</Heading>;
    const helper = assertion.value ? (
      <Alert bsStyle={this.getAlertStyle(assertion)} className="display-flex flex-wrap flex-vertical-align flex-1" style={{padding:'.7rem 1rem', minHeight: '5.9rem'}}>
        <code style={{fontSize: '1.4rem'}}>{selectedHeaderResult || 'Select a header below'}</code>{this.renderChosenRelationship(assertionIndex)}{this.renderOperand(assertionIndex)}
      </Alert>
    ) : null;
    return (
      <div>
        {title}
        {helper}
        {buttons}
      </div>
    );
  },
  renderHeader(assertionIndex){
    const assertion = this.state.assertions[assertionIndex];
    const selectedHeaderResult = _.get(this.getResponseFormatted(), `headers.${assertion.value}`);
    const headers = _.get(this.getResponseFormatted(), 'headers') || {};
    const headerKeys = _.keys(headers);
    let buttons = null;
    if (!assertion.relationship && assertion.value){
      buttons = this.renderRelationshipButtons(assertionIndex);
    } else if (!assertion.value){
      buttons = (
        <Padding t={1}>
          {headerKeys.map(key => {
            return (
              <Button flat nocap onClick={this.runSetAssertionData.bind(null, assertionIndex, {value: key})} color="text" style={{margin: '0 .5rem 1rem'}} key={`assertion-${assertionIndex}-header-key-${key}`}>{key}</Button>
            );
          })}
        </Padding>
      )
    }
    const title = <Heading level={4}>Header{selectedHeader ? ` - ${selectedHeader}` : null}</Heading>;
    const helper = assertion.value ? (
      <Alert bsStyle={this.getAlertStyle(assertion)} className="display-flex flex-wrap flex-vertical-align flex-1" style={{padding:'.7rem 1rem', minHeight: '5.9rem'}}>
        <code style={{fontSize: '1.4rem'}}>{selectedHeaderResult || 'Select a header below'}</code>{this.renderChosenRelationship(assertionIndex)}{this.renderOperand(assertionIndex)}
      </Alert>
    ) : null;
    return (
      <div>
        {title}
        {helper}
        {buttons}
      </div>
    );
  },
  renderAssertion(assertion, index){
    const key = assertion.key || 'code';
    return (
      <div className="display-flex">
        <div className="flex-1">
          {this[`render${_.capitalize(key)}`](index)}
        </div>
        <div className="align-flex-start">
          {this.renderDeleteButton(index)}
        </div>
      </div>
    );
  },
  renderAssertionPickType(){
    return (
      <div>
        {['code', 'header', 'body'].map(type => {
          if (flag(`assertion-type-${type}`)){
            return (
              <Button flat color="primary" onClick={this.runNewAssertion.bind(null, type)} className="flex-1" style={{margin: '0 1rem 1rem 0'}} key={`assertion-button-${type}`}>
                <Add inline fill="primary"/>&nbsp;{_.capitalize(type)}
              </Button>
            );
          }
          return null;
        })}
      </div>
    );
  },
  renderAssertionList(){
    if (!this.getResponse().code){
      return null;
    }
    if (this.state.assertions.length){
      return this.state.assertions.map((assertion, index) => {
        return (
          <div key={`assertion-${index}`}>
            {this.renderAssertion(assertion, index)}
            <hr/>
          </div>
        );
      });
    }
    return (
      <div>
        <p>Choose from the options below to set up assertions for this check.</p>
        <hr/>
      </div>
    );
  },
  render(){
    return (
      <Padding b={2}>
        {this.renderAssertionList()}
        {this.renderAssertionPickType()}
        <p><em className="small text-muted">Learn more about assertions <a target="_blank" href="/docs/checks">in our docs</a>.</em></p>
      </Padding>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AssertionsSelection);