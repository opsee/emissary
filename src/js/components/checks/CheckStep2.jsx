import React from 'react';
import Actions from '../../actions/CheckActions';
import Link from 'react-router/lib/components/Link';
import forms from 'newforms';
import _ from 'lodash';

import slate from 'slate';
import assertionTypes from 'slate/src/types';
import relationships from 'slate/src/relationships';

import OpseeInputWithLabel from '../forms/OpseeInputWithLabel.jsx';
import OpseeDropdown from '../forms/OpseeDropdown.jsx';
import AssertionCounter from '../forms/AssertionCounter.jsx';


function opseeInputs(bf){
  const type = bf.field.constructor.name;
  function output(type){
    switch(type){
      case 'ChoiceField':
      return(
        <OpseeDropdown bf={bf}/>
      );
      break;
      default:
      return(
        <OpseeInputWithLabel bf={bf}/>
      );
      break;
    }
  }
  return (
    <div>
      <div className="form-group">
        {output(type)}
      </div>
    </div>
  )
}

const assertionTypeOptions = assertionTypes.map(assertion => [assertion.id, assertion.name]);
const relationshipOptions = relationships.map(relationship => [relationship.id, relationship.name]);

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
    widgetAttrs:{
      placeholder:'operand'
    },
    required:false
  })
});

const AssertionsFormSet = forms.FormSet.extend({
  form:AssertionsForm
});

const AllFields = React.createClass({
  getInitialState() {
    var obj = {
      assertions: new AssertionsFormSet({
        onChange: this.forceUpdate.bind(this), 
        labelSuffix:'',
        initial:this.props.check.assertions,
        extra:0
      }),
      response:this.props.response
    };
    //this is a workaround because the library is not working correctly with initial + data formset
    const self = this;
    setTimeout(function(){
      self.state.assertions.forms().forEach((form,i) => {
        form.setData(self.props.check.assertions[i]);
      });
    },10);
    return obj;
  },
  operandInputNeeded(form, bf){
    const data = form.cleanedData;
    if(data && data.relationship){
      if(data.type == 'header' || !data.relationship.match('empty|notEmpty')){
        return(
          <div className="col-xs-10 col-xs-offset-2">
            {opseeInputs(bf)}
          </div>
        )
      }
    }
  },
  valueInputNeeded(form, bf){
    const data = form.cleanedData;
    if(data && data.relationship && data.type == 'header'){
      if(!data.relationship.match('empty|notEmpty')){
        return(
          <div className="col-xs-10 col-xs-offset-2">
            {opseeInputs(bf)}
          </div>
        )
      }
    }
  },
  renderAssertionsForm(){
    return(
      <div>
        <h2>Assertions</h2>
        {this.state.assertions.forms().map((form, index) => {
          return (
            <div>
              <div className="display-flex">
                <div className="row flex-1">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-xs-2">
                        <AssertionCounter label={index} fields={form.boundFields()} response={this.state.response}/>
                      </div>
                      {form.boundFields().map(bf => {
                        switch(bf.name){
                          case 'type':
                          return(
                            <div className="col-xs-10 col-sm-4">
                              {opseeInputs(bf)}
                            </div>
                          );
                          break;
                          case 'relationship':
                          return(
                            <div className="col-xs-10 col-xs-offset-2 col-sm-6 col-sm-offset-0">
                              {opseeInputs(bf)}
                            </div>
                          );
                          break;
                          case 'operand':
                          return this.operandInputNeeded(form, bf);
                          break;
                          case 'value':
                          return this.valueInputNeeded(form, bf);
                        }
                      })}
                    </div>
                  </div>
                </div>
                <div className="padding-lr">
                    <button type="button" className="btn btn-icon btn-flat" onClick={this.state.assertions.removeForm.bind(this.state.assertions,index)} title="Remove this Header">
                      remove
                    {
                      //<svg className="icon" viewBox="0 0 24 24"><use xlink:href="#ico_close" /></svg>
                    }
                  </button>
                </div>
              </div>
            </div>
          )
        })
        }
        <button type="button" className="btn btn-info" onClick={this.state.assertions.addAnother.bind(this.state.assertions)}>Add Another Assertion</button>
      </div>
    )
  },
  cleanedData(){
    const obj = {
      assertions:this.state.assertions.cleanedData()
    }
    return _.assign(obj);
  },
  renderSubmitButton(){
    if(this.props.standalone){
      return(
        <button type="submit" className="btn btn-primary">Submit</button>
      )
    }
  },
  render() {
    return (
      <form ref="form" onSubmit={this.onSubmit}>
          <h2>Add Assertions</h2>
          <p>Define the conditions required for this check to pass. Your response and request are shown for context. You must have at least one assertion per check.</p>
          <br />
          {this.renderAssertionsForm()}
          {this.renderSubmitButton()}
                <h2>Your Response &amp; Request</h2>
      <p>We are including the content of your response and your request to help you define assertions.</p>
      <br/>
          <pre>{this.state.response && JSON.stringify(this.state.response, null, ' ')}</pre>
          {
            <pre>{this.cleanedData && JSON.stringify(this.cleanedData(), null, ' ')}</pre>
          }
          {
            // <strong>Non field errors: {nonFieldErrors.render()}</strong>
          }
      </form>
    )
  },
  onSubmit(e) {
    e.preventDefault()
    this.state.info.validate(this.refs.info)
    this.state.assertions.validate(this.refs.headers)
    this.forceUpdate();
    console.log(this.cleanedData());
  }
})

export default AllFields;