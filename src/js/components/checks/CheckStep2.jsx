import React from 'react';
import router from '../../modules/router.js';
import {Link} from 'react-router';
import {Grid, Row, Col, Button} from '../../modules/bootstrap';
import forms from 'newforms';
import _ from 'lodash';
import {Toolbar} from '../global';
import slate from 'slate';
import assertionTypes from 'slate/src/types';
import relationships from 'slate/src/relationships';
import {BoundField} from '../forms';
import AssertionCounter from '../forms/AssertionCounter.jsx';
import {Close, Add} from '../icons';
import colors from 'seedling/colors';
import Highlight from '../global/Highlight.jsx';
import {StepCounter} from '../global';

const assertionTypeOptions = assertionTypes.map(assertion => [assertion.id, assertion.name]);
const relationshipOptions = relationships.map(relationship => [relationship.id, relationship.name]);

function relationshipConcernsEmpty(relationship){
  if(typeof relationship == 'string' && relationship.match('empty|notEmpty')){
    return true;
  }
  return false;
}

const AssertionsForm = forms.Form.extend({
  type: forms.ChoiceField({choices:assertionTypeOptions}),
  relationship: forms.ChoiceField({
    choices:relationshipOptions,
  }),
  operand: forms.CharField({
    widgetAttrs:{
      placeholder:'operand'
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
    switch(this.cleanedData.type){
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
  form:AssertionsForm
});

const AllFields = React.createClass({
  getInitialState() {
    const self = this;
    console.log(this.props.check);
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
    this.props.onChange(this.getCleanedData(), this.disabled(), 2)
  },
  renderOperand(form, key){
    const data = form.cleanedData;
    if(data && data.relationship){
      if(data.type == 'header' || !data.relationship.match('empty|notEmpty')){
        return(
          <div className="col-xs-10 col-xs-offset-2" key={key}>
            <BoundField bf={form.boundField('operand')}/>
          </div>
        )
      }
    }
  },
  renderValue(form, key){
    const data = form.cleanedData;
    if(data && data.relationship && data.type == 'header'){
      if(!data.relationship.match('empty|notEmpty')){
        return (
          <div className="col-xs-10 col-xs-offset-2" key={key}>
            <BoundField bf={form.boundField('value')}/>
          </div>
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
  renderAssertionsForm(){
    return(
      <div>
        {this.state.assertions.forms().map((form, index) => {
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
                          case 'type':
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
                {this.renderRemoveAssertionButton(index)}
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
  getCleanedData(){
    const obj = {
      assertions:this.state.assertions.cleanedData()
    }
    return _.assign({}, obj);
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
    return !_.chain(this.state.assertions.forms()).map(a => a.isComplete()).every().value();
    return !this.state.assertions.isValid();
  },
  submit(e){
    e.preventDefault();
    router.transitionTo('checkCreateStep3');
  },
  innerRender() {
    return (
      <form ref="form" onSubmit={this.submit}>
        <h2>Add Assertions</h2>
        <p>Define the conditions required for this check to pass. Your response and request are shown for context. You must have at least one assertion per check.</p>
        <br />
        {this.renderAssertionsForm()}
        <div><br/></div>
        <h2>Your Response &amp; Request</h2>
        <p>We are including the content of your response and your request to help you define assertions.</p>
        <Highlight>
          {this.state.formattedResponse && JSON.stringify(this.state.formattedResponse, null, ' ')}
        </Highlight>
        {this.renderSubmitButton()}
      </form>
    )
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnleft={true} title={`Create a Check: Step 2`}/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
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

export default AllFields;