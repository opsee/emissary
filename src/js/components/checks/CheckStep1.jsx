import React from 'react';
import _ from 'lodash';
import router from '../../modules/router';
import forms from 'newforms';
import colors from 'seedling/colors';
import {Grid, Row, Col, Button} from '../../modules/bootstrap';

import {Link} from 'react-router';
import OpseeBoundField from '../forms/OpseeBoundField.jsx';
import BottomButtonNav from '../global/BottomButtonNav.jsx';
import {Toolbar} from '../global';
import {Close, ChevronRight} from '../icons';

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
        <h2>Choose an AWS Group</h2>
        <OpseeBoundField bf={this.boundField('group')}/>
        <h2>Define an HTTP Request</h2>
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

function step1DataComplete(){
  return 
}

const AllFields = React.createClass({
  getInitialState() {
    const self = this;
    const obj = {
      info: new InfoForm(_.extend({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
        // data:self.props.check,
        // errors:forms.ErrorObject.fromJSON({})
      }, self.dataComplete() ? {data:self.props.check} : null)),
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
  dataComplete(){
    return _.chain(['group', 'port', 'method', 'path']).map(s => this.props.check[s]).every().value();
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
              <Row>
                <Col xs={12}>
                  <h3>Header {index+1}</h3>
                </Col>
              </Row>
              <div className="display-flex">
                <div className="row flex-1">
                <Grid fluid={true}>
                  <Row>
                    {form.boundFields().map((bf, i) => {
                      return(
                        <Col xs={12} sm={6} key={`header-field-${index}-${i}`}>
                          <OpseeBoundField bf={bf}/>
                        </Col>
                      )
                    })}
                    </Row>
                  </Grid>
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
        <Button bsStyle="info" onClick={this.state.headers.addAnother.bind(this.state.headers)}>
            Add {!this.state.headers.forms().length ? 'A' : 'Another'} Header
        </Button>
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
        <Button bsStyle="success" block={true} type="submit" onClick={this.submit} disabled={this.disabled()}>
          Submit
        </Button>
      )
    }else{
      return(
        <div>
          <div><br/><br/></div>
          <div>
            <Button bsStyle="success" block={true} type="submit" onClick={this.submit} disabled={this.disabled()} title={this.disabled() ? 'Complete the form to move on.' : 'Define Assertions'}>
                <span>Next: Define Assertions
                  <ChevronRight inline={true} fill={colors.success}/>
                </span>
            </Button>
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
  },
  disabled(){
    //TODO validate header form as well
    let headersComplete = _.chain(this.state.headers.forms()).map(h => h.isComplete()).every().value();
    return !(this.state.info.isComplete() && headersComplete);
    return !this.state.info.isComplete();
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
        <Toolbar btnPosition="midRight" title="Create Check Step 1">
          <Link to="checks" className="btn btn-icon btn-flat">
            <Close btn={true}/>
          </Link>
        </Toolbar>
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
  },
})

export default AllFields;