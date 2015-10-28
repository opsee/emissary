import React, {PropTypes} from 'react';
import router from '../../modules/router.js';
import {Grid, Row, Col} from '../../modules/bootstrap';
import forms from 'newforms';
import _ from 'lodash';
import {Toolbar, StepCounter} from '../global';

import assertionTypes from 'slate/src/types';
import relationships from 'slate/src/relationships';
import {BoundField} from '../forms';
import {Close, Add} from '../icons';
import AssertionCounter from './AssertionCounter.jsx';
import CheckResponse from './CheckResponse.jsx';
import {CheckStore} from '../../stores';
import {Padding} from '../layout';
import {Button} from '../forms';

const assertionTypeOptions = assertionTypes.map(assertion => [assertion.id, assertion.name]);
const relationshipOptions = relationships.map(relationship => [relationship.id, relationship.name]);

function relationshipConcernsEmpty(relationship){
  if (typeof relationship === 'string' && relationship.match('empty|notEmpty')){
    return true;
  }
  return false;
}

const AssertionsForm = forms.Form.extend({
  key: forms.ChoiceField({
    widgetAttrs: {
      noLabel: true
    },
    choices: assertionTypeOptions
  }),
  relationship: forms.ChoiceField({
    widgetAttrs: {
      noLabel: true
    },
    choices: relationshipOptions
  }),
  operand: forms.CharField({
    label: 'Value',
    widgetAttrs: {
      placeholder: 'Value'
    },
    required: false
  }),
  value: forms.CharField({
    label: 'Header Key',
    widgetAttrs: {
      placeholder: 'i.e. Content-Type'
    },
    required: false
  }),
  clean: () => {
    if (!relationshipConcernsEmpty(this.cleanedData.relationship)){
      if (!this.cleanedData.operand){
        throw forms.ValidationError('Assertion must have operand.');
      }
    }
    switch (this.cleanedData.key){
    case 'code':
      break;
    case 'header':
      if (!relationshipConcernsEmpty(this.cleanedData.relationship)){
        if (!this.cleanedData.value){
          throw forms.ValidationError('Header assertion must have a value.');
        }
      }
      break;
    default:
      break;
    }
  }
});

const AssertionsFormSet = forms.FormSet.extend({
  form: AssertionsForm,
  canDelete: true
});

const CheckCreateAssertions = React.createClass({
  propTypes: {
    check: PropTypes.object,
    response: PropTypes.object,
    onChange: PropTypes.func,
    renderAsInclude: PropTypes.bool
  },
  getInitialState() {
    const self = this;
    const obj = {
      assertions: new AssertionsFormSet({
        onChange: self.runChange,
        labelSuffix: '',
        initial: this.props.check.assertions,
        minNum: !this.props.check.assertions.length ? 1 : 0,
        extra: 0
      }),
      response: this.props.response
    };
    //this is a workaround because the library is not working correctly with initial + data formset
    setTimeout(() => {
      self.state.assertions.forms().forEach((form, i) => {
        //checking here accounts for empty assertion forms
        let data = self.props.check.assertions[i];
        if (data){
          form.setData(data);
        }
      });
    }, 10);
    return obj;
  },
  isDisabled(){
    return !_.chain(this.getAssertionsForms()).map(a => a.isComplete()).every().value();
  },
  getAssertionsForms(){
    return _.reject(this.state.assertions.forms(), f => {
      return f.cleanedData.DELETE;
    });
  },
  getFinalData(){
    let check = _.clone(this.props.check);
    check.assertions = _.reject(this.state.assertions.cleanedData(), 'DELETE').map(a => {
      return _.omit(a, 'DELETE');
    });
    return check;
  },
  getFormattedResponse(){
    return CheckStore.getFormattedResponse(this.props.response);
  },
  runChange(){
    this.props.onChange(this.getFinalData(), this.isDisabled(), 2);
  },
  handleSubmit(e){
    e.preventDefault();
    router.transitionTo('checkCreateInfo');
  },
  renderOperand(form){
    const data = form.cleanedData;
    if (data && data.relationship){
      if (data.key === 'header' || !data.relationship.match('empty|notEmpty')){
        return (
          <Row>
            <Padding t={1}>
              <Col xs={12}>
                <BoundField bf={form.boundField('operand')}/>
              </Col>
            </Padding>
          </Row>
        );
      }
    }
  },
  renderValue(form, key){
    const data = form.cleanedData;
    if (data && data.relationship && data.key === 'header'){
      if (!data.relationship.match('empty|notEmpty')){
        return (
          <Row>
            <Padding t={1}>
              <Col xs={12} key={key}>
                <BoundField bf={form.boundField('value')}/>
              </Col>
            </Padding>
          </Row>
        );
      }
    }
    return <div/>;
  },
  renderDeleteAssertionButton(form, index){
    if (index > 0){
      return (
        <Col xs={2} sm={1}>
          <BoundField bf={form.boundField('DELETE')}/>
        </Col>
      );
    }
    return <span/>;
  },
  renderAssertionsForm(){
    return (
      <div>
        {this.getAssertionsForms().map((form, index) => {
          return (
            <Grid fluid key={`assertion-${index}`}>
              <Padding tb={1}>
              <Row>
                <Col xs={2} sm={1}>
                  <AssertionCounter label={index + 1} {...form.cleanedData} keyData={form.cleanedData.key} response={this.props.response}/>
                </Col>
                <Col xs={8} sm={10}>
                  <Row>
                    <Col xs={12}>
                      <Row>
                        <Col xs={12} sm={6} key={`assertion-key-${index}`}>
                          <BoundField bf={form.boundField('key')}/>
                          <Padding t={1} className="visible-xs"/>
                        </Col>
                        <Col xs={12} sm={6} smOffset={0} key={`assertion-relationship-${index}`}>
                          <BoundField bf={form.boundField('relationship')}/>
                        </Col>
                      </Row>
                    </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                      {this.renderValue(form, `assertion-${index}-value-field`)}
                      {this.renderOperand(form, `assertion-${index}-operand-field`)}
                      </Col>
                    </Row>
                  </Col>
                  {this.renderDeleteAssertionButton(form, index)}
                </Row>
              </Padding>
            </Grid>
          );
        })
        }
        <Padding t={1}>
          <Button color="primary" flat onClick={this.state.assertions.addAnother.bind(this.state.assertions)}>
            <Add inline fill="primary"/> Add Assertion
          </Button>
        </Padding>
      </div>
    );
  },
  renderSubmitButton(){
    if (!this.props.renderAsInclude){
      return (
        <div>
          <div><br/><br/></div>
          <div>
            <Button color="success" block type="submit" onClick={this.submit} disabled={this.disabled()} chevron>Next</Button>
          </div>
          <StepCounter active={3} steps={4}/>
        </div>
      );
    }
    return <div/>;
  },
  renderInner() {
    return (
      <form ref="form" onSubmit={this.handleSubmit}>
        <Padding t={1}>
          <h3>Assertions</h3>
        </Padding>
        <p>Define the conditions required for this check to pass. Your response and request are shown for context. You must have at least one assertion.</p>
        <br />
        {this.renderAssertionsForm()}
        <div><br/></div>
        {this.renderSubmitButton()}
      </form>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title={`Create Check (3 of 4)`} bg="info">
          <Button to="checks" icon flat>
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={1}>
                <h3>Response to Your Request</h3>
                <p>The complete response that came back from your request.</p>
                <Padding tb={1}>
                  <CheckResponse check={this.props.check}/>
                </Padding>
              </Padding>
              <Padding tb={1}>
                {this.renderInner()}
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  },
  render() {
    return this.props.renderAsInclude ? this.renderInner() : this.renderAsPage();
  }
});

export default CheckCreateAssertions;