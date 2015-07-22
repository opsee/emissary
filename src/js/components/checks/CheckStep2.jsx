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
  relationship: forms.ChoiceField({choices:relationshipOptions}),
  operand: forms.CharField({
    widgetAttrs:{
      placeholder:'operand'
    }
  })
});

const AssertionsFormSet = forms.FormSet.extend({
  form:AssertionsForm
});

const Info = forms.Form.extend({
  // group: forms.ChoiceField({choices:groupOptions}),
  // port: forms.CharField({
  //   widgetAttrs:{
  //     placeholder:'e.g. 8080'
  //   }
  // }),
  // method: forms.ChoiceField({choices:methodOptions}),
  // path: forms.CharField({
  //   widgetAttrs:{
  //     placeholder:'e.g. /healthcheck'
  //   }
  // })
});

const InfoFormSet = forms.FormSet.extend({
  form:Info
})

const InfoForm = forms.Form.extend({
  // info: new InfoFormSet(),
  // group: forms.ChoiceField({choices:groupOptions}),
  port: forms.CharField({
    widgetAttrs:{
      placeholder:'e.g. 8080'
    }
  }),
  // method: forms.ChoiceField({choices:methodOptions}),
  path: forms.CharField({
    widgetAttrs:{
      placeholder:'e.g. /healthcheck'
    }
  }),
  // headers: new AssertionsFormSet(),
  clean() {
  },
  getCleanedData(){
    return {
      headers: this.state.assertions.cleanedData()
    }
  },
  render() {
    return(
      <div>
        <h2>Choose a Group to Check</h2>
        {opseeInputs(this.boundField('group'))}
        <h2>Define a Request</h2>
        {this.boundFields((field, fieldName) => {
          if(fieldName.match('protocol|port|method|path')){
            return true;
          }
          return false;
        }).map(opseeInputs)}
        {
          // opseeInputs(this.boundField('group')).map(opseeInputs)
        }
        {
          // this.headers.forms().map(form => form.boundFields().map(opseeInputs))
        }
      </div>
    )
  }
})

const data = {
  port:80
}

const AllFields = React.createClass({
  getInitialState() {
    return({
      info: new InfoForm({onChange: this.forceUpdate.bind(this), labelSuffix:'', data:data}),
      assertions: new AssertionsFormSet({onChange: this.forceUpdate.bind(this), labelSuffix:'', data:data})
    })
  },
  assertionPassing(index){
    return true;
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
                        <AssertionCounter label={index} fields={form.boundFields()}/>
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
                          return(
                            <div className="col-xs-10 col-xs-offset-2">
                              {opseeInputs(bf)}
                            </div>
                            );
                          break;
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
        <button className="btn btn-info" onClick={this.state.assertions.addAnother.bind(this.state.assertions)}>Add Another Header</button>
      </div>
    )
  },
  cleanedData(){
    const headers = {
      headers:this.state.assertions.cleanedData()
    }
    return _.assign(headers, this.state.info.cleanedData);
  },
  render() {
    const nonFieldErrors = this.state.info.nonFieldErrors()
    return (
      <form ref="form" onSubmit={this.onSubmit}>
          <h2>Add Assertions</h2>
          <p>Define the conditions required for this check to pass. Your response and request are shown for context. You must have at least one assertion per check.</p>
          <br />
          {this.renderAssertionsForm()}
          <button type="submit" className="btn btn-primary">Submit</button>
          {
            //<pre>{this.cleanedData && JSON.stringify(this.cleanedData(), null, ' ')}</pre>
          }
          {
            <strong>Non field errors: {nonFieldErrors.render()}</strong>
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