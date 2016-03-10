import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';
import Autosuggest from 'react-autosuggest';

import {BoundField, Button} from '../forms';
import {Add, Delete} from '../icons';
import {Padding, Rule} from '../layout';
import {Color, Heading} from '../type';
import {Expandable, Highlight} from '../global';
import {flag, validate} from '../../modules';
import relationships from 'slate/src/relationships';
import slate from 'slate';
import getKeys from '../../modules/getKeys';
import {
  integrations as actions
} from '../../actions';

const AssertionsSelection = React.createClass({
  propTypes: {
    check: PropTypes.object,
    assertions: PropTypes.array,
    response: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    redux: PropTypes.shape({
      user: PropTypes.object,
      checks: PropTypes.shape({
        responses: PropTypes.object
      }),
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
      const assertions = this.props.assertions.map(this.getNewSchema);
      this.runChange(assertions);
    }
  },
  getForm(type = 'code', kwargs){
    const self = this;
    let obj = null;
    switch (type){
    case 'code':
      obj = forms.Form.extend({
        operand: forms.CharField({
          widgetAttrs: {
            noLabel: true
          }
        })
      });
      break;
    case 'header':
      obj = forms.Form.extend({
        operand: forms.CharField({
          widgetAttrs: {
            noLabel: true
          }
        })
      });
      break;
    case 'json':
      obj = forms.Form.extend({
        operand: forms.CharField({
          widgetAttrs: {
            noLabel: true
          }
        }),
        value: forms.CharField({
          label: 'JSON path (optional) <a target="_blank" href="/docs/checks#json">Learn More</a>',
          required: false,
          widgetAttrs: {
            placeholder: self.getJsonPlaceholder()
          }
        })
      });
      break;
    default:
      obj = forms.Form.extend({
        operand: forms.CharField({
          label: 'Value',
          widgetAttrs: {
            noLabel: true
          }
        })
      });
      break;
    }
    return new obj(kwargs);
  },
  getNewSchema(assertion = {}, assertionIndex){
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
      initial: _.omitBy(assertion, a => !a)
    };
    return _.assign({}, assertion, {
      form: this.getForm(assertion.key, opts)
    });
  },
  getJsonBodyKeys(){
    const json = this.getJsonBody();
    if (json){
      const keys = getKeys(json);
      if (Array.isArray(keys) && keys.length){
        return keys;
      }
    }
    return [];
  },
  getFilteredJsonBodyKeys(assertionIndex){
    const assertion = this.state.assertions[assertionIndex];
    return this.getJsonBodyKeys().filter(path => {
      return path.match(`^${_.escapeRegExp(assertion.value)}`);
    });
  },
  getJsonPlaceholder(){
    const keys = this.getJsonBodyKeys();
    const last = _.chain(keys).sortBy(keys, k => k.length).last().value();
    return last || 'animals.dogs[0].breed';
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
  getResponseBody(){
    const json = this.getJsonBody();
    return json ? JSON.stringify(json) : this.getResponse().body;
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
      return smashed.match('json') && json;
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
    };
  },
  getBodySnippet(assertion){
    const meta = this.getJsonPathMeta(assertion);
    if (meta && meta.data && assertion.value){
      if (meta.scalar){
        return this.renderReturnedValue(assertion, meta.data);
      }
      return (
        <Highlight wrap style={{width: '100%'}} noBg>
          {meta.data}
        </Highlight>
      );
    } else if (!meta.data && assertion.value){
      return this.renderReturnedValue(assertion, '>> No JSON data selected', 'danger');
    }
    return (
      <Expandable style={{width: '100%'}} noFade>
        <Highlight wrap noBg>
          {this.getResponseBody()}
        </Highlight>
      </Expandable>
    );
  },
  getAssertionStyle(assertion){
    let border = 'gray7';
    let test = this.getSlateTest(assertion);
    if (test && test.success){
      border = 'success';
    } else if (test){
      border = 'danger';
    }
    return {
      borderLeft: `.8rem solid ${seed.color[border]}`
    };
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
  runNewAssertion(key){
    const assertions = this.state.assertions.concat([
      this.getNewSchema({key}, this.state.assertions.length)
    ]);
    this.runChange(assertions);
  },
  runDelete(index){
    const assertions = _.reject(this.state.assertions, (n, i) => i === index);
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
  handleJsonSuggestionSelect(assertionIndex, event, data){
    this.runSetAssertionData(assertionIndex, {
      value: data.newValue
    });
  },
  handleSubmit(e){
    e.preventDefault();
    return false;
  },
  renderRelationshipButtons(assertionIndex){
    const assertion = this.state.assertions[assertionIndex];
    return (
      <Padding t={1} style={{width: '100%'}}>
        {relationships.map(rel => {
          let data = {
            relationship: rel.id
          };
          if (rel.id === 'equal' && !assertion.operand){
            if (assertion.key === 'code'){
              data.operand = this.getResponseFormatted().code || '';
            } else if (assertion.key === 'header'){
              data.operand = _.get(this.getResponseFormatted(), `headers.${assertion.value}`) || '';
            } else if (assertion.key === 'json'){
              data.operand = this.getJsonPathMeta(assertion).data || '';
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
        <Padding t={1}>
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
        <Padding l={1} className="flex-1 align-self-end">
          <BoundField bf={this.state.assertions[assertionIndex].form.boundField('operand')}/>
        </Padding>
      );
    }
    return null;
  },
  renderReturnedValue(assertion, value){
    return (
      <Padding b={1}>
        <code style={{fontSize: '1.4rem'}}><Color c="gray500">{value}</Color></code>
      </Padding>
    );
  },
  renderTitle(assertionIndex, title){
    return (
      <Heading level={3} className="display-flex flex-1 flex-vertical-align" style={{marginBottom: '-1rem'}}>
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
        <Padding l={2} t={1} b={1} r={1} style={this.getAssertionStyle(assertion)}>
          {this.renderReturnedValue(assertion, this.getResponse().code)}
          <div className="display-flex">
            {this.renderChosenRelationship(assertionIndex)}
            {this.renderOperand(assertionIndex)}
          </div>
          {buttons}
        </Padding>
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
      );
    }
    const helper = assertion.value ? (
      <div>
        <div style={{width: '100%'}}>
          {this.renderReturnedValue(assertion, selectedHeaderResult)}
        </div>
        <div className="display-flex">
          {this.renderChosenRelationship(assertionIndex)}
          {this.renderOperand(assertionIndex)}
        </div>
      </div>
    ) : null;
    const title = selectedHeader ? ` - ${selectedHeader}` : '';
    return (
      <div>
        {this.renderTitle(assertionIndex, `Response Header${title}`)}
        <Padding l={2} t={1} b={1} r={1} style={this.getAssertionStyle(assertion)}>
          {helper}
          {buttons}
        </Padding>
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
        <Padding l={2} t={1} b={1} r={1} style={this.getAssertionStyle(assertion)}>
          {this.getBodySnippet(assertion) || 'Select a header below'}
          {this.renderChosenRelationship(assertionIndex)}
          {this.renderOperand(assertionIndex)}
          {buttons}
        </Padding>
      </div>
    );
  },
  renderSuggestion(suggestion){
    return <span>{suggestion}</span>;
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
        <Padding l={2} t={1} b={1} r={1} style={this.getAssertionStyle(assertion)}>
          {this.getBodySnippet(assertion) || 'Select a header below'}
          <Padding t={0.5} b={1}>
            <div className="form-group">
              <label className="label" htmlFor={`json-path-${assertionIndex}`}>JSON path (optional) <a target="_blank" href="/docs/checks#json">Learn More</a></label>
              <Autosuggest suggestions={this.getFilteredJsonBodyKeys(assertionIndex)} inputProps={{onChange: this.handleJsonSuggestionSelect.bind(null, assertionIndex), value: assertion.value || '', placeholder: this.getJsonPlaceholder(), id: `json-path-${assertionIndex}`}} renderSuggestion={this.renderSuggestion} getSuggestionValue={(s) => s} style={{width: '100%'}} shouldRenderSuggestions={() => true}/>
            </div>
          </Padding>
          <div className="display-flex">
            {this.renderChosenRelationship(assertionIndex)}
            {this.renderOperand(assertionIndex)}
          </div>
          {buttons}
        </Padding>
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
          <Heading level={3}>Add an Assertion</Heading>
        </Padding>
        {['code', 'header', 'body'].map(type => {
          let schemaType = type;
          if (this.getJsonBody() && type === 'body'){
            schemaType = 'json';
          }
          let name = _.capitalize(type);
          if (name === 'Code'){
            name = 'Status Code';
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
    return null;
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