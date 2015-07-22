import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/CheckActions';
import Link from 'react-router/lib/components/Link';
import forms from 'newforms';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import _ from 'lodash';

const OpseeLabel = React.createClass({
  render(){
    return(
      <label htmlFor={this.props.id}>
        <span className="form-label">{this.props.label}</span>
        <span className="form-message">
          {this.props.errors}
        </span>
      </label>
    )
  }
});

const OpseeInputWithLabel = React.createClass({
  render(){
    return(
      <div>
      <OpseeLabel {...this.props}/>
      {this.props.bf.render()}
    </div>
    )
  }
});

const OpseeDropdown = React.createClass({
  getInitialState(){
    return this.props;
  },
  onSelect(key){
    this.props.onChange.call(this,key);
    let choice = _.find(this.props.choices, choice => choice[0] == key);
    this.setState({
      label:choice[1]
    })
  },
  render(){
    return(
      <DropdownButton title={this.state.label} key={this.props.id}>
      {
        this.props.choices.map(choice => {
          return (
            <MenuItem eventKey={choice[0]} onSelect={this.onSelect}>{choice[1]}</MenuItem>
          )
        })
      }
      </DropdownButton>
    )
  }
});

function opseeInputs(bf){
  const type = bf.field.constructor.name;
  const errors = bf.errors().messages().map(message => <div>{message}</div>)
  function onChange(e,t){
    const obj = {};
    obj[bf.name] = e;
    bf.form.updateData(obj);
  }
  return (
    <div>
      <div className="form-group">
          {
            (function(){
              switch(type){
                case 'ChoiceField':
                return(
                  <OpseeDropdown label={bf.label} id={bf.idForLabel()} bf={bf} choices={bf.field._choices} onChange={onChange}/>
                );
                break;
                default:
                return(
                  <OpseeInputWithLabel label={bf.label} id={bf.idForLabel()} bf={bf}/>
                );
                break;
              }
            }
          )()
        }
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
  key: forms.CharField(),
  value: forms.CharField()
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
        {this.boundFields().map(opseeInputs)}
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
    return (
      <div>
      {this.state.headers.forms().map(form => form.boundFields().map(opseeInputs))}
      <button className="btn btn-info">Add Another Header</button>
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
        <div>
            {this.state.info.render()}
            {this.renderHeaderForm()}
            <button type="submit" className="btn btn-primary">Submit</button>
          <pre>{this.cleanedData && JSON.stringify(this.cleanedData(), null, ' ')}</pre>
          <strong>Non field errors: {nonFieldErrors.render()}</strong>
        </div>
      </form>
    )
  },
  onSubmit(e) {
    e.preventDefault()
    this.state.form.validate(this.refs.form)
    this.forceUpdate()
  }
})

export default AllFields;