import React from 'react';
import Actions from '../../actions/Check';
import router from '../../router.jsx';
import Link from 'react-router/lib/components/Link';
import forms from 'newforms';
import _ from 'lodash';
import OpseeBoundField from '../forms/OpseeBoundField.jsx';
import BottomButtonNav from '../global/BottomButtonNav.jsx';
import Toolbar from '../global/Toolbar.jsx';
import {Close, ChevronRight} from '../icons/Module.jsx';
import colors from 'seedling/colors';

const groupOptions = [
  ['group-1','Group 1'],
  ['group-2','Group 2']
]

const methodOptions = ['GET','POST','PUT','DELETE','PATCH'].map(name => [name, name]);

const HeaderForm = forms.Form.extend({
  key: forms.CharField({
    widgetAttrs:{
      placeholder:'e.g. content-type'
    },
  }),
  value: forms.CharField({
    widgetAttrs:{
      placeholder:'e.g. application/json'
    },
  }),
});

const HeaderFormSet = forms.FormSet.extend({
  form:HeaderForm,
});

const InfoForm = forms.Form.extend({
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
  clean() {
  },
  render() {
    return(
      <div>
        <h2>Choose a Group</h2>
        <OpseeBoundField bf={this.boundField('group')}/>
        <h2>Define a Request</h2>
        {this.boundFields((field, fieldName) => {
          if(fieldName.match('protocol|port|method|path')){
            return true;
          }
          return false;
        }).map((bf, i) => {
          return (
            <OpseeBoundField bf={bf} key={i}/>
          );
        })
      }
      </div>
    )
  }
})

const AllFields = React.createClass({
  getInitialState() {
    const self = this;
    const obj = {
      info: new InfoForm({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
        data:this.props.check
      }),
      headers: new HeaderFormSet({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
        // initial:this.props.check && this.props.check.headers || [],
        emptyPermitted:false,
        extra:0,
        // canDelete:true,
        validation:{
          on:'blur change'
        }
      }),
      check:this.props.check
    }
    //this is a workaround because the library is not working correctly with initial + data formset
    setTimeout(function(){
      self.state.headers.forms().forEach((form,i) => {
        form.setData(self.props.check.headers[i]);
      });
    },10);
    return _.extend(obj, {
      cleanedData:null
    });
  },
  changeAndUpdate(){
    this.props.onChange(this.getCleanedData());
    this.setState({cleanedData:this.getCleanedData()});
    // this.forceUpdate();
  },
  renderHeaderForm(){
    return(
      <div>
        <h2>Request Headers</h2>
        {this.state.headers.forms().map((form, index) => {
          return (
            <div key={`header-form-${index}`}>
              <div className="row">
                <div className="col-xs-12">
                  <h3>Header {index+1}</h3>
                </div>
              </div>
              <div className="display-flex">
                <div className="row flex-1">
                  <div className="container-fluid">
                    <div className="row">
                      {form.boundFields().map((bf, i) => {
                        return(
                          <div className="col-xs-12 col-sm-6" key={`header-field-${index}-${i}`}>
                            <OpseeBoundField bf={bf}/>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="padding-lr">
                  <button type="button" className="btn btn-icon btn-flat" onClick={this.state.headers.removeForm.bind(this.state.headers,index)} title="Remove this Header">
                      <Close btn={true}/>
                  </button>
                </div>
              </div>
            </div>
          )
        })
        }
        <button type="button" className="btn btn-info" onClick={this.state.headers.addAnother.bind(this.state.headers)}>Add {!this.state.headers.forms().length ? 'A' : 'Another'} Header</button>
      </div>
    )
  },
  getCleanedData(){
    let headerData = this.state.headers.cleanedData();
    // let headerData = this.state.headers.data;
    const data = {
      headers:headerData
    }
    return _.assign(data, this.state.info.cleanedData);
  },
  renderSubmitButton(){
    if(this.props.standalone){
      return(
        <button type="submit" className="btn btn-primary">Submit</button>
      )
    }else{
      return(
        <div>
          <div><br/><br/></div>
          <div>
            <button className="btn btn-success btn-block" type="submit" onClick={this.submit} disabled={this.disabled()}>
              <span>Next: Test This Request 
                <ChevronRight inline={true} fill={colors.success}/>
              </span>
            </button>
          </div>
        </div>
      )
    }
  },
  renderLink(){
    return this.state.check.id ? <Link to="check" params={{id:this.state.check.id}} className="btn btn-primary btn-fab" title="Edit {check.name}"/> : '<div/>';
  },
  submit(e){
    e.preventDefault();
    router.transitionTo('checkCreateStep2');
    // this.props.stepSubmit(this.getCleanedData());
  },
  disabled(){
    //TODO validate header form as well
    // return !(this.state.info.isValid() && this.state.headers.isValid());
    return !this.state.info.isValid();
  },
  innerRender(){
    const nonFieldErrors = this.state.info.nonFieldErrors();
    return (
      <form name="checkStep1Form" ref="form" onSubmit={this.submit}>
          {this.state.info.render()}
          {this.renderHeaderForm()}
          {this.renderSubmitButton()}
          {
            // <pre>{this.getCleanedData && JSON.stringify(this.getCleanedData(), null, ' ')}</pre>
          }
          {
            // <strong>Non field errors: {nonFieldErrors.render()}</strong>
          }
      </form>
    )
  },
  renderAsPage(){
    return (
      <div>
        <div className="bg-body" style={{position:"relative"}}>
          <Toolbar btnPosition="midRight" title="Create Check Step 1">
            <Link to="checks" className="btn btn-icon btn-flat">
              <Close btn={true}/>
            </Link>
          </Toolbar>
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              {this.innerRender()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  render() {
    return this.props.renderAsInclude ? this.innerRender() : this.renderAsPage();
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