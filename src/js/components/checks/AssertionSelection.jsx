import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';

import {BoundField, Button} from '../forms';
import {Add, Checkmark, ChevronRight, Delete} from '../icons';
import {Padding, Rule} from '../layout';
import {Color, Heading} from '../type';
import {Expandable, Highlight} from '../global';
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
    widgetAttrs: {
      noLabel: true
    }
  })
});

const HeaderForm = forms.Form.extend({
  operand: forms.CharField({
    widgetAttrs: {
      noLabel: true
    }
  })
});

const JsonForm = forms.Form.extend({
  operand: forms.CharField({
    widgetAttrs: {
      noLabel: true
    }
  }),
  value: forms.CharField({
    label: 'JSON path (optional) <a target="_blank" href="/docs/checks#json">Learn More</a>',
    required: false,
    widgetAttrs: {
      placeholder: 'animals.dogs[0]'
    }
  })
});

const BodyForm = forms.Form.extend({
  operand: forms.CharField({
    label: 'Value',
    widgetAttrs: {
      noLabel: true
    }
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
      case 'json':
        form = new JsonForm(opts);
      break;
      default:
        break;
    }
    return {
      key,
      relationship: null,
      value,
      operand: null,
      form,
      useJson: undefined
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
    const initial = {
      code: undefined,
      headers: [],
      body: undefined
    };
    if (data && data.response){
      return _.chain(data).get('response.value').defaults(initial).value();
    }
    return initial;
  },
  getSlateTest(assertion){
    let response = this.getResponse();
    response.body = typeof response.body === 'object' ? JSON.stringify(response.body) : response.body;
    if (response && response.body && validate.assertion(assertion)){
      return slate.checkAssertion(assertion, response);
    }
    return null;
  },
  getJsonBody(){
    try {
      const res = this.getResponse();
      const body = _.get(res, 'body');
      const json = JSON.parse(body);
      const type = _.chain(res).get('headers').find({name: 'Content-Type'}).get('values').value() || [];
      const smashed = type.join(';');
      return smashed.match('json') && typeof json === 'object' && json;
    } catch (err){
      return false;
    }
  },
  getJsonPathMeta(assertion){
    const body = this.getJsonBody();
    let data = null;
    let scalar = false;
    if (body){
      try {
        data = _.get(body, assertion.value);
        if (data){
          scalar = (typeof data === 'string' || typeof data === 'number') ? true : false;
          data = scalar ? data : JSON.stringify(data);
        }
      } catch (err){
        _.noop();
      }
    }
    return {
      data,
      scalar
    }
  },
  getBodySnippet(assertion){
    const meta = this.getJsonPathMeta(assertion);
    if (meta && meta.data && assertion.value){
      if (meta.scalar){
        return (
          <Padding b={1} style={{width: '100%'}}>
            <Padding style={{background: seed.color.gray9}}>
              <code style={{fontSize: '1.4rem'}}><Color c="primary">{meta.data}</Color></code>
            </Padding>
          </Padding>
        );
      }
      return (
        <Padding b={1} style={{width: '100%'}}>
          <Highlight wrap>
            {meta.data}
          </Highlight>
        </Padding>
      );
    } else if (!meta.data && assertion.value){
      return 'No JSON data selected';
    }
    return (
      <Padding b={1} style={{width: '100%'}}>
        <Expandable>
          <Highlight wrap>
            {this.getResponse().body}
          </Highlight>
        </Expandable>
      </Padding>
    );
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
      let d = {};
      if (index === i){
        d = data;
        assertion.form.setData(_.defaults(data, assertion));
      }
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
    const assertion = this.state.assertions[assertionIndex];
    return (
      <Padding t={1} style={{width: '100%'}}>
        {relationships.map(rel => {
          let data = {
            relationship: rel.id
          };
          if (rel.id === 'equal'){
            if (assertion.key === 'code'){
              data.operand = this.getResponseFormatted().code;  
            } else if (assertion.key === 'header'){
              data.operand = _.get(this.getResponseFormatted(), `headers.${assertion.value}`);
            }
          }
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
        <Button flat color="text" onClick={this.runSetAssertionData.bind(null, assertionIndex, {relationship: null})}>{obj.name}</Button>
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
  renderTitle(assertionIndex, title){
    return (
      <Heading level={4} className="display-flex flex-1 flex-vertical-align">
        <span className="flex-1">#{assertionIndex + 1} {title}</span>
        <Button flat color="danger" title="Remove this Assertion" onClick={this.runDelete.bind(null, assertionIndex)} style={{padding: '0.2rem'}}>
          <Delete inline fill="danger"/>
        </Button>
      </Heading>
    );
  },
  renderCode(assertionIndex){
    const assertion = this.state.assertions[assertionIndex];
    let buttons = null;
    if (!assertion.relationship){
      buttons = this.renderRelationshipButtons(assertionIndex);
    }
    return (
      <div>
        {this.renderTitle(assertionIndex, 'Response Code')}
        <Alert bsStyle={this.getAlertStyle(assertion)} style={{padding:'.7rem 1rem', minHeight: '5.9rem'}}>
          <Padding b={1} style={{width: '100%'}}>
            <Padding style={{background: seed.color.gray9}}>
              <code style={{fontSize: '1.4rem'}}><Color c="primary">{this.getResponse().code}</Color></code>
            </Padding>
          </Padding>
          <div className="display-flex">
            {this.renderChosenRelationship(assertionIndex)}
            {this.renderOperand(assertionIndex)}
          </div>
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
    const helper = assertion.value ? (
      <Alert bsStyle={this.getAlertStyle(assertion)} className="flex-1" style={{padding:'.7rem 1rem', minHeight: '5.9rem'}}>
        <Padding b={1} style={{width: '100%'}}>
          <Padding style={{background: seed.color.gray9}}>
            <code style={{fontSize: '1.4rem'}}><Color c="primary">{selectedHeaderResult}</Color></code>
          </Padding>
        </Padding>
        <div className="display-flex">
          {this.renderChosenRelationship(assertionIndex)}
          {this.renderOperand(assertionIndex)}
        </div>
      </Alert>
    ) : null;
    const title = selectedHeader ? ` - ${selectedHeader}` : '';
    return (
      <div>
        {this.renderTitle(assertionIndex, `Response Header${title}`)}
        {helper}
        {buttons}
      </div>
    );
  },
  renderJsonInput(assertion){
    const jsonBody = this.getJsonBody();
    if (jsonBody){
      return (
        <Padding b={1} style={{width: '100%'}}>
          <BoundField bf={assertion.form.boundField('value')}/>
        </Padding>
      );
    }
    return null;
  },
  renderBody(assertionIndex){
    const assertion = this.state.assertions[assertionIndex];
    let buttons = null;
    if (!assertion.relationship){
      buttons = this.renderRelationshipButtons(assertionIndex);
    }
    return (
      <div>
        {this.renderTitle(assertionIndex, 'Plaintext Response Body')}
        <Alert bsStyle={this.getAlertStyle(assertion)} className="display-flex flex-wrap flex-vertical-align flex-1" style={{padding:'.7rem 1rem', minHeight: '5.9rem'}}>
          {this.getBodySnippet(assertion) || 'Select a header below'}
          {this.renderChosenRelationship(assertionIndex)}
          {this.renderOperand(assertionIndex)}
        </Alert>
        {buttons}
      </div>
    );
  },
  renderJson(assertionIndex){
    const assertion = this.state.assertions[assertionIndex];
    let buttons = null;
    if (!assertion.relationship){
      buttons = this.renderRelationshipButtons(assertionIndex);
    }
    return (
      <div>
        {this.renderTitle(assertionIndex, 'JSON Response Body')}
        <Alert bsStyle={this.getAlertStyle(assertion)} className="display-flex flex-wrap flex-vertical-align flex-1" style={{padding:'.7rem 1rem', minHeight: '5.9rem'}}>
          {this.renderJsonInput(assertion)}
          {this.getBodySnippet(assertion) || 'Select a header below'}
          {this.renderChosenRelationship(assertionIndex)}
          {this.renderOperand(assertionIndex)}
        </Alert>
        {buttons}
      </div>
    );
  },
  renderAssertion(assertion, index){
    const key = assertion.key || 'code';
    return (
      <Padding key={`assertion-${index}`} b={2}>
        {this[`render${_.capitalize(key)}`](index)}
      </Padding>
    );
  },
  renderAssertionPickType(){
    return (
      <div>
        <Rule/>
        <Padding t={1}>
          <Heading level={4}>Pick an Assertion Type</Heading>
        </Padding>
        {['code', 'header', 'body'].map(type => {
          let schemaType = type;
          if (this.getJsonBody() && type === 'body'){
            schemaType = 'json';
          }
          let name = _.capitalize(type);
          if (name === 'Code'){
            name = 'Status Code'
          }
          if (flag(`assertion-type-${type}`)){
            return (
              <Button flat color="primary" onClick={this.runNewAssertion.bind(null, schemaType)} className="flex-1" style={{margin: '0 1rem 1rem 0'}} key={`assertion-button-${type}`}>
                <Add inline fill="primary"/>&nbsp;{name}
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
      return this.state.assertions.map(this.renderAssertion);
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