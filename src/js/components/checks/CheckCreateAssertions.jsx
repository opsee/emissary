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
import AssertionCounter from '../forms/AssertionCounter.jsx';
import CheckResponse from './CheckResponse.jsx';
import colors from 'seedling/colors';
import Highlight from '../global/Highlight.jsx';
import {CheckStore} from '../../stores';

const assertionTypeOptions = assertionTypes.map(assertion => [assertion.id, assertion.name]);
const relationshipOptions = relationships.map(relationship => [relationship.id, relationship.name]);

function relationshipConcernsEmpty(relationship){
  if(typeof relationship == 'string' && relationship.match('empty|notEmpty')){
    return true;
  }
  return false;
}

const AssertionsForm = forms.Form.extend({
  key: forms.ChoiceField({choices:assertionTypeOptions}),
  relationship: forms.ChoiceField({
    choices:relationshipOptions,
  }),
  operand: forms.CharField({
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
          <Col xs={10} xsOffset={2}>
            <BoundField bf={form.boundField('operand')}/>
          </Col>
        )
      }
    }
  },
  renderValue(form, key){
    const data = form.cleanedData;
    if(data && data.relationship && data.key == 'header'){
      if(!data.relationship.match('empty|notEmpty')){
        return (
          <Col xs={10} xsOffset={2} key={key}>
            <BoundField bf={form.boundField('value')}/>
          </Col>
        )
      }
    }
    return <div/>
  },
  renderRemoveAssertionButton(index){
    if(index > 0){
      return (
        <div className="padding-lr">
            <button type="button" className="btn btn-icon btn-flat" onClick={this.removeAssertion.bind(null,index)} title="Remove this Assertion">
              <Close btn={true}/>
          </button>
        </div>
      )
    }else{
      return (
       <div className="padding-lr">
         <div style={{width:'48px'}}/>
       </div>
      )
    }
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
      return <BoundField bf={form.boundField('DELETE')}/>
    }else{
      return <span/>
    }
  },
  renderAssertionsForm(){
    return(
      <div>
        {this.getAssertionsForms().map((form, index) => {
          return (
            <div key={`assertion-${index}`}>
              <div className="display-flex">
                <div className="row flex-1">
                  <Grid fluid={true}>
                    <Row>
                      <Col xs={2}>
                        <AssertionCounter label={index} fields={form.boundFields()} response={this.state.response}/>
                      </Col>
                      {form.boundFields().map((bf, bfi) => {
                        switch(bf.name){
                          case 'key':
                          return(
                            <Col xs={10} sm={4} key={`assertion-${index}-field-${bfi}`}>
                              <BoundField bf={bf}/>
                            </Col>
                          );
                          break;
                          case 'relationship':
                          return(
                            <Col xs={10} xsOffset={2} sm={6} smOffset={0} key={`assertion-${index}-field-${bfi}`}>
                              <BoundField bf={bf}/>
                            </Col>
                          );
                          break;
                        }
                      })}
                      {this.renderValue(form, `assertion-${index}-value-field`)}
                      {this.renderOperand(form, `assertion-${index}-operand-field`)}
                    </Row>
                  </Grid>
                </div>
                {this.renderDeleteAssertionButton(form, index)}
                {
                  // this.renderRemoveAssertionButton(index)
                }
              </div>
            </div>
          )
        })
        }
        <Button className="btn-flat btn-primary btn-nopad" onClick={this.state.assertions.addAnother.bind(this.state.assertions)}><Add fill={colors.primary} inline={true}/> Add Another Assertion
        </Button>
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
          <StepCounter active={2} steps={3}/>
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
        <div className="padding-t">
          <h2>Add Assertions</h2>
        </div>
        <p>Define the conditions required for this check to pass. Your response and request are shown for context. You must have at least one assertion per check.</p>
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
        <Toolbar btnleft={true} title={`Create Check (3 of 4)`}/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <CheckResponse check={this.props.check}/>
              {this.innerRender()}
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