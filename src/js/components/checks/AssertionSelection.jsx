import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {plain as seed} from 'seedling';
import Autosuggest from 'react-autosuggest';

import {Button} from '../forms';
import {Add, Delete} from '../icons';
import {Expandable, Padding, Rule} from '../layout';
import {Color, Heading} from '../type';
import {Highlight} from '../global';
import {flag, validate, getKeys} from '../../modules';
import relationships from 'slate/src/relationships';
import slate from 'slate';
import {Input} from '../forms';

const AssertionsSelection = React.createClass({
  propTypes: {
    check: PropTypes.object,
    assertions: PropTypes.array,
    response: PropTypes.object,
    responseFormatted: PropTypes.object,
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
    const assertion = this.props.assertions[assertionIndex];
    return this.getJsonBodyKeys().filter(path => {
      return path.match(`^${_.escapeRegExp(assertion.value)}`);
    });
  },
  getJsonPlaceholder(){
    const keys = this.getJsonBodyKeys();
    const last = _.chain(keys).sortBy(keys, k => k.length).last().value();
    return last || 'animals.dogs[0].breed';
  },
  getFinalAssertions(assertions = this.props.assertions){
    return _.cloneDeep(assertions).map(n => _.pick(n, ['key', 'value', 'relationship', 'operand']));
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
    if (response && validate.assertion(assertion)){
      return slate.checkAssertion(assertion, response);
    }
    return null;
  },
  getJsonBody(){
    try {
      const res = this.getResponseFormatted();
      const body = _.get(res, 'body');
      const json = typeof body === 'string' ? JSON.parse(body) : body;
      const type = _.chain(res).get('headers').get('Content-Type').value();
      return type.match('json') && json;
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
        return this.renderReturnedValue(meta.data);
      }
      return (
        <div>
          <Highlight wrap style={{width: '100%'}} noBg>
            {meta.data}
          </Highlight>
          <Rule/>
        </div>
      );
    } else if (!meta.data && assertion.value){
      return this.renderReturnedValue('>> No JSON data selected', 'danger');
    }
    return (
      <div>
        <Expandable style={{width: '100%'}} noFade>
          <Highlight wrap noBg>
            {this.getResponseBody()}
          </Highlight>
        </Expandable>
        <Rule/>
      </div>
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
  getMetric(name){
    const response = this.getResponseFormatted();
    const metrics = _.get(response, 'metrics');
    if (!metrics || !Array.isArray(metrics)){
      return null;
    }
    const val = _.chain(metrics).find({name}).get('value').value();
    //need to use only 2 decimals to conform to slate
    if (typeof val === 'number'){
      return parseFloat(val.toFixed(2));
    }
    return null;
  },
  runSetAssertionsState(iteratee){
    const assertions = _.cloneDeep(this.props.assertions).map(iteratee);
    return assertions;
  },
  runChange(assertions = this.props.assertions){
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
    const data = _.cloneDeep(this.props.assertions);
    const assertions = data.concat([
      {key}
    ]);
    this.runChange(assertions);
  },
  runDelete(index){
    const assertions = _.reject(this.props.assertions, (n, i) => i === index);
    this.runChange(assertions);
  },
  runSetAssertionData(index, data){
    const assertions = _.cloneDeep(this.props.assertions).map((assertion, i) => {
      return index === i ? _.assign(assertion, data) : assertion;
    });
    return this.runChange(assertions);
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
    const assertion = this.props.assertions[assertionIndex];
    return (
      <Padding t={1} style={{width: '100%'}}>
        {relationships.map(rel => {
          let data = {
            relationship: rel.id
          };
          if (rel.id === 'equal' && !assertion.operand){
            if (assertion.key === 'code'){
              const code = this.getResponseFormatted().code;
              data.operand = code ? code.toString() : '';
            } else if (assertion.key === 'header'){
              data.operand = _.get(this.getResponseFormatted(), `headers.${assertion.value}`) || '';
            } else if (assertion.key === 'json'){
              data.operand = this.getJsonPathMeta(assertion).data || '';
            } else if (assertion.key === 'metric'){
              data.operand = this.getMetric(assertion.value);
            }
          }
          return (
            <Button flat onClick={this.runSetAssertionData.bind(null, assertionIndex, data)} color="text" style={{margin: '0 1rem 1rem 0'}} key={`assertion-${assertionIndex}-relationship-${rel.id}`}>{rel.name}</Button>
          );
        })}
      </Padding>
    );
  },
  renderChosenRelationship(assertionIndex){
    const assertion = this.props.assertions[assertionIndex];
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
    const assertion = this.props.assertions[assertionIndex];
    const attrs = [
      ['code', 'Status Code Value'],
      ['header', 'Header Value'],
      ['json', 'JSON data'],
      ['metric', 'Metric Value'],
      ['body', 'Body data']
    ];
    const placeholder = _.chain(attrs)
    .find(arr => arr[0] === assertion.key)
    .get(1)
    .value();
    if (assertion.relationship && !assertion.relationship.match('empty|notEmpty')){
      return (
        <Padding l={1} className="flex-1 align-self-end">
          <Input data={assertion} path="operand" onChange={this.runSetAssertionData.bind(null, assertionIndex)} placeholder={placeholder}/>
        </Padding>
      );
    }
    return null;
  },
  renderReturnedValue(value){
    return (
      <div>
        <code style={{fontSize: '1.4rem'}}><Color c="primary">{value}</Color></code>
        <Rule/>
      </div>
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
    const assertion = this.props.assertions[assertionIndex];
    let buttons = null;
    if (!assertion.relationship){
      buttons = this.renderRelationshipButtons(assertionIndex);
    }
    return (
      <div>
        {this.renderTitle(assertionIndex, 'Response Code')}
        <Padding l={2} t={1} b={1} r={1} style={this.getAssertionStyle(assertion)}>
          {this.renderReturnedValue(this.getResponse().code)}
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
    const assertion = this.props.assertions[assertionIndex];
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
          {this.renderReturnedValue(selectedHeaderResult)}
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
  renderMetric(assertionIndex){
    const assertion = this.props.assertions[assertionIndex];
    const metrics = [
      {
        id: 'request_latency',
        name: 'Round-Trip Time',
        title: 'Round-Trip Time (ms)'
      }
    ];
    let buttons = null;
    if (!assertion.relationship && assertion.value){
      buttons = this.renderRelationshipButtons(assertionIndex);
    } else if (!assertion.value){
      buttons = (
        <Padding t={1}>
          {metrics.map(metric => {
            return (
              <Button flat nocap onClick={this.runSetAssertionData.bind(null, assertionIndex, {value: metric.id})} color="text" style={{margin: '0 .5rem 1rem'}} key={`assertion-${assertionIndex}-metric-key-${metric.id}`}>{metric.name}</Button>
            );
          })}
        </Padding>
      );
    }
    const helper = assertion.value ? (
      <div>
        <div style={{width: '100%'}}>
          {this.renderReturnedValue(this.getMetric(assertion.value))}
        </div>
        <div className="display-flex">
          {this.renderChosenRelationship(assertionIndex)}
          {this.renderOperand(assertionIndex)}
        </div>
      </div>
    ) : null;
    let title = _.chain(metrics).find({id: assertion.value}).get('title').value() || '';
    title = title ? ` - ${title}` : '';
    return (
      <div>
        {this.renderTitle(assertionIndex, `Metric${title}`)}
        <Padding l={2} t={1} b={1} r={1} style={this.getAssertionStyle(assertion)}>
          {helper}
          {buttons}
        </Padding>
      </div>
    );
  },
  renderBody(assertionIndex){
    const assertion = this.props.assertions[assertionIndex];
    let buttons = null;
    if (!assertion.relationship){
      buttons = this.renderRelationshipButtons(assertionIndex);
    }
    return (
      <div>
        {this.renderTitle(assertionIndex, 'Plaintext Response Body')}
        <Padding l={2} t={1} b={1} r={1} style={this.getAssertionStyle(assertion)}>
          {this.getBodySnippet(assertion) || 'Select a header below'}
          <div className="display-flex">
            {this.renderChosenRelationship(assertionIndex)}
            {this.renderOperand(assertionIndex)}
          </div>
          {buttons}
        </Padding>
      </div>
    );
  },
  renderSuggestion(suggestion){
    return <span>{suggestion}</span>;
  },
  renderJson(assertionIndex){
    const assertion = this.props.assertions[assertionIndex];
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
  renderAssertionPickType(){
    return (
      <div>
        <Rule/>
        <Padding t={1}>
          <Heading level={3}>Add an Assertion</Heading>
        </Padding>
        {['code', 'header', 'body', 'metric'].map(type => {
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
  renderAssertion(assertion, index){
    const key = assertion.key || 'code';
    return (
      <Padding key={`assertion-${index}`} b={2}>
        {this[`render${_.capitalize(key)}`](index)}
      </Padding>
    );
  },
  renderAssertionList(){
    if (this.props.assertions.length){
      return this.props.assertions.map(this.renderAssertion);
    }
    return null;
  },
  render(){
    return (
      <div>
        {this.renderAssertionList()}
        {this.renderAssertionPickType()}
        <p><em className="small text-muted">Learn more about assertions <a target="_blank" href="/docs/checks">in our docs</a>.</em></p>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps)(AssertionsSelection);