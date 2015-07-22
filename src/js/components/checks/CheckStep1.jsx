import React from 'react';
import Actions from '../../actions/CheckActions';
import Link from 'react-router/lib/components/Link';
import forms from 'newforms';
import _ from 'lodash';

import OpseeInputWithLabel from '../forms/OpseeInputWithLabel.jsx';
import OpseeDropdown from '../forms/OpseeDropdown.jsx';

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

const groupOptions = [
  ['group-1','Group 1'],
  ['group-2','Group 2']
]

const methodOptions = ['GET','POST','PUT','DELETE','PATCH'].map(name => [name,name]);

const HeaderForm = forms.Form.extend({
  key: forms.CharField({
    widgetAttrs:{
      placeholder:'e.g. content-type'
    }
  }),
  value: forms.CharField({
    widgetAttrs:{
      placeholder:'e.g. application/json'
    }
  })
});

const HeaderFormSet = forms.FormSet.extend({
  form:HeaderForm
});

const Info = forms.Form.extend({
  group: forms.ChoiceField({choices:groupOptions}),
  port: forms.CharField({
    widgetAttrs:{
      placeholder:'e.g. 8080'
    }
  }),
  method: forms.ChoiceField({choices:methodOptions}),
  path: forms.CharField({
    widgetAttrs:{
      placeholder:'e.g. /healthcheck'
    }
  })
});

const InfoFormSet = forms.FormSet.extend({
  form:Info
})

const InfoForm = forms.Form.extend({
  // info: new InfoFormSet(),
  group: forms.ChoiceField({choices:groupOptions}),
  port: forms.CharField({
    widgetAttrs:{
      placeholder:'e.g. 8080'
    }
  }),
  method: forms.ChoiceField({choices:methodOptions}),
  path: forms.CharField({
    widgetAttrs:{
      placeholder:'e.g. /healthcheck'
    }
  }),
  // headers: new HeaderFormSet(),
  clean() {
  },
  getCleanedData(){
    return {
      headers: this.state.headers.cleanedData()
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
      headers: new HeaderFormSet({onChange: this.forceUpdate.bind(this), labelSuffix:'', data:data})
    })
  },
  renderHeaderForm(){
    return(
      <div>
        <h2>Request Headers</h2>
        {this.state.headers.forms().map((form, index) => {
          return (
            <div>
              <div className="row">
                <div className="col-xs-12">
                  <h3>Header {index+1}</h3>
                </div>
              </div>
              <div className="display-flex">
                <div className="row flex-1">
                  <div className="container-fluid">
                    <div className="row">
                      {form.boundFields().map(bf => {
                        return(
                          <div className="col-xs-12 col-sm-6">
                            {opseeInputs(bf)}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="padding-lr">
                    <button type="button" className="btn btn-icon btn-flat" onClick={this.state.headers.removeForm.bind(this.state.headers,index)} title="Remove this Header">
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
        <button className="btn btn-info" onClick={this.state.headers.addAnother.bind(this.state.headers)}>Add Another Header</button>
      </div>
    )
  },
  cleanedData(){
    const headers = {
      headers:this.state.headers.cleanedData()
    }
    return _.assign(headers, this.state.info.cleanedData);
  },
  render() {
    const nonFieldErrors = this.state.info.nonFieldErrors()
    return (
      <form ref="form" onSubmit={this.onSubmit}>
          {this.state.info.render()}
          {this.renderHeaderForm()}
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
    this.state.headers.validate(this.refs.headers)
    this.forceUpdate();
    console.log(this.cleanedData());
  }
})

export default AllFields;