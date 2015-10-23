import React from 'react';
import router from '../../modules/router.js';
import {Link} from 'react-router';
import {Grid, Row, Col, Button} from '../../modules/bootstrap';
import forms from 'newforms';
import _ from 'lodash';
import {Toolbar, StepCounter} from '../global';

import slate from 'slate';
import assertionTypes from 'slate/src/types';
import relationships from 'slate/src/relationships';
import {BoundField} from '../forms';
import {Close, Add} from '../icons';
import AssertionCounter from './AssertionCounter.jsx';
import CheckResponse from './CheckResponse.jsx';
import colors from 'seedling/colors';
import Highlight from '../global/Highlight.jsx';
import {CheckStore} from '../../stores';
import {Padding} from '../layout';

const assertionTypeOptions = assertionTypes.map(assertion => [assertion.id, assertion.name]);
const relationshipOptions = relationships.map(relationship => [relationship.id, relationship.name]);

function relationshipConcernsEmpty(relationship){
  if(typeof relationship == 'string' && relationship.match('empty|notEmpty')){
    return true;
  }
  return false;
}

const AssertionsForm = forms.Form.extend({
  key: forms.ChoiceField({
    widgetAttrs:{
      noLabel: true
    },
    choices:assertionTypeOptions
  }),
  relationship: forms.ChoiceField({
    widgetAttrs:{
      noLabel: true
    },
    choices:relationshipOptions,
  }),
  operand: forms.CharField({
    label: 'Value',
    widgetAttrs:{
      placeholder:'Value'
    },
    required:false
  }),
  value: forms.CharField({
    label:'Header Key',
    widgetAttrs:{
      placeholder:'i.e. Content-Type'
    },
    required:false
  }),
  clean:function(){
    if(!relationshipConcernsEmpty(this.cleanedData.relationship)){
      if(!this.cleanedData.operand){
        throw forms.ValidationError('Assertion must have operand.');
      }
    }
    switch(this.cleanedData.key){
      case 'code':
      break;
      case 'header':
      if(!relationshipConcernsEmpty(this.cleanedData.relationship)){
        if(!this.cleanedData.value){
          throw forms.ValidationError('Header assertion must have a value.');
        }
      }
    }
  }
});

const AssertionsFormSet = forms.FormSet.extend({
  form:AssertionsForm,
  canDelete:true
});

const CheckCreateAssertions = React.createClass({
  getInitialState() {
    const self = this;
    var obj = {
      assertions: new AssertionsFormSet({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
        initial:this.props.check.assertions,
        minNum:!this.props.check.assertions.length ? 1 : 0,
        extra:0
      }),
      response:this.props.response,
      formattedResponse:this.props.formattedResponse
    };
    //this is a workaround because the library is not working correctly with initial + data formset
    setTimeout(function(){
      self.state.assertions.forms().forEach((form, i) => {
        //checking here accounts for empty assertion forms
        let data = self.props.check.assertions[i];
        if(data){
          form.setData(data);
        }
      });
    },10);
    return obj;
  },
  changeAndUpdate(){
    this.props.onChange(this.getFinalData(), this.disabled(), 2)
  },
  renderOperand(form, key){
    const data = form.cleanedData;
    if(data && data.relationship){
      if(data.key == 'header' || !data.relationship.match('empty|notEmpty')){
        return(
          <Row>
            <Padding t={1}>
              <Col xs={12}>
                <BoundField bf={form.boundField('operand')}/>
              </Col>
            </Padding>
          </Row>
        )
      }
    }
  },
  renderValue(form, key){
    const data = form.cleanedData;
    if(data && data.relationship && data.key == 'header'){
      if(!data.relationship.match('empty|notEmpty')){
        return (
          <Row>
            <Padding t={1}>
              <Col xs={12} key={key}>
                <BoundField bf={form.boundField('value')}/>
              </Col>
            </Padding>
          </Row>
        )
      }
    }
    return <div/>
  },
  removeAssertion(index){
    if(index > 0){
      this.state.assertions.removeForm(index);
    }
  },
  getAssertionsForms(){
    return _.reject(this.state.assertions.forms(), f => {
      return f.cleanedData.DELETE;
    });
  },
  renderDeleteAssertionButton(form, index){
    if(index > 0){
      return (
        <Col xs={2} sm={1}>
          <BoundField bf={form.boundField('DELETE')}/>
        </Col>
      )
    }else{
      return <span/>
    }
  },
  renderAssertionsForm(){
    return(
      <div>
        {this.getAssertionsForms().map((form, index) => {
          return (
            <Grid fluid={true} key={`assertion-${index}`}>
              <Padding tb={1}>
              <Row>
                <Col xs={2} sm={1}>
                  <AssertionCounter label={index+1} {...form.cleanedData} keyData={form.cleanedData.key} response={this.props.response}/>
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
          )
        })
        }
        <Padding t={1}>
          <Button bsStyle="primary" className="btn-flat" onClick={this.state.assertions.addAnother.bind(this.state.assertions)}>
            <Add className="icon"/> Add Assertion
          </Button>
        </Padding>
      </div>
    )
  },
  getFinalData(){
    let check = _.clone(this.props.check);
    check.assertions = _.reject(this.state.assertions.cleanedData(), 'DELETE').map(a => {
      return _.omit(a, 'DELETE');
    })
    return check;
  },
  getFormattedResponse(){
    return CheckStore.getFormattedResponse(this.props.response);
  },
  renderSubmitButton(){
    if(!this.props.renderAsInclude){
      return(
        <div>
          <div><br/><br/></div>
          <div>
            <Button bsStyle="success" block={true} type="submit" onClick={this.submit} disabled={this.disabled()} chevron={true}>Next</Button>
          </div>
          <StepCounter active={3} steps={4}/>
        </div>
      )
    }else{
      return <div/>
    }
  },
  disabled(){
    return !_.chain(this.getAssertionsForms()).map(a => a.isComplete()).every().value();
  },
  submit(e){
    e.preventDefault();
    router.transitionTo('checkCreateInfo');
  },
  innerRender() {
    return (
      <form ref="form" onSubmit={this.submit}>
        <Padding t={1}>
          <h3>Assertions</h3>
        </Padding>
        <p>Define the conditions required for this check to pass. Your response and request are shown for context. You must have at least one assertion.</p>
        <br />
        {this.renderAssertionsForm()}
        <div><br/></div>
        {this.renderSubmitButton()}
      </form>
    )
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title={`Create Check (3 of 4)`} bg="info">
          <Link to="checks" className="btn btn-icon btn-flat">
            <Close btn={true}/>
          </Link>
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
                {this.innerRender()}
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  },
  render() {
    return this.props.renderAsInclude ? this.innerRender() : this.renderAsPage();
  }
})

export default CheckCreateAssertions;