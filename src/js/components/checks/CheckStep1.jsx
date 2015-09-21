import React from 'react';
import _ from 'lodash';
import router from '../../modules/router';
import forms from 'newforms';
import colors from 'seedling/colors';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';

import {Link} from 'react-router';
import {BoundField, Button} from '../forms';
import {Toolbar, StepCounter, Loader} from '../global';
import {Close, Add} from '../icons';
import {UserDataRequirement} from '../user';
import {UserActions, GroupActions} from '../../actions';
import {GroupStore} from '../../stores';

const groupOptions = []

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
  group: forms.ChoiceField({
    choices:[]
  }),
  port: forms.CharField({
    widgetAttrs:{
      placeholder:'e.g. 8080',
    },
    widget:forms.NumberInput
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
        <BoundField bf={this.boundField('group')}/>
        <h2>Define an HTTP Request</h2>
        {this.boundFields((field, fieldName) => {
          if(fieldName.match('protocol|port|method|path')){
            return true;
          }
          return false;
        }).map((bf, i) => {
          return (
            <BoundField bf={bf} key={`bound-field-${i}`}/>
          );
        })
      }
      </div>
    )
  }
})

const AllFields = React.createClass({
  mixins:[GroupStore.mixin],
  storeDidChange(){
    const status = GroupStore.getGetGroupsSecurityStatus();
    if(status == 'success'){
      this.state.info.fields.group.setChoices(this.getGroupChoices());
      this.setState({
        groups:GroupStore.getGroupsSecurity()
      });
    }
  },
  getInitialState() {
    const self = this;
    const obj = {
      info: new InfoForm(_.extend({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
      }, self.dataComplete() ? {data:self.props.check} : null)),
      headers: new HeaderFormSet({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
        emptyPermitted:false,
        extra:0,
        validation:{
          on:'blur change',
          onChangeDelay:150
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
  getGroupChoices(){
    return GroupStore.getGroupsSecurity().toJS().map(g => {
      return [g.id, g.name];
    });
  },
  componentWillMount(){
    GroupActions.getGroupsSecurity();
  },
  componentDidMount(){
    if(this.props.renderAsInclude){
      this.changeAndUpdate();
    }
  },
  changeAndUpdate(){
    this.props.onChange(this.getCleanedData(), this.disabled(), 1);
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
                          <BoundField bf={bf}/>
                        </Col>
                      )
                    })}
                    </Row>
                  </Grid>
                </div>
                <div className="padding-lr">
                  <Button icon={true} flat={true} onClick={this.state.headers.removeForm.bind(this.state.headers,index)} title="Remove this Header">
                      <Close btn={true}/>
                  </Button>
                </div>
              </div>
            </div>
          )
        })
        }
        <Button flat={true} bsStyle="primary" noPad={true} onClick={this.state.headers.addAnother.bind(this.state.headers)}>
            <Add fill={colors.primary} inline={true}/> Add {!this.state.headers.forms().length ? 'A' : 'Another'} Header
        </Button>
      </div>
    )
  },
  getCleanedData(){
    let headerData = this.state.headers.cleanedData();
    const data = {
      headers:headerData
    }
    return _.assign(data, this.state.info.cleanedData);
  },
  renderSubmitButton(){
    if(!this.props.renderAsInclude){
      return(
        <div>
          <div><br/><br/></div>
          <div>
            <Button bsStyle="success" block={true} type="submit" onClick={this.submit} disabled={this.disabled()} title={this.disabled() ? 'Complete the form to move on.' : 'Define Assertions'} chevron={true}>Next: Define Assertions</Button>
          </div>
          <StepCounter active={1} steps={3}/>
        </div>
      )
    }else{
      return <div/>
    }
  },
  renderLink(){
    return this.state.check.id ? <Link to="check" params={{id:this.state.check.id}} className="btn btn-primary btn-fab" title="Edit {check.name}"/> : <div/>;
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
  dismissHelperText(){
    UserActions.userPutUserData('hasDismissedCheckCreationHelp');
  },
  renderHelperText(){
      return (
        <UserDataRequirement hideIf="hasDismissedCheckCreationHelp">
          <Alert type="info" onDismiss={this.dismissHelperText}>
            <p>Let’s create your first health check! Tell us which security group to check, and Opsee will apply it to the right instances.<br/>Only HTTP checks are supported right now.</p>
          </Alert>
          <div><br/></div>
        </UserDataRequirement>
      )
  },
  innerRender(){
    const nonFieldErrors = this.state.info.nonFieldErrors();
    // if(this.state.groups){
      return (
        <form name="checkStep1Form" ref="form" onSubmit={this.submit}>
          {this.renderHelperText()}
          {this.state.info.render()}
          {this.renderHeaderForm()}
          {this.renderSubmitButton()}
        </form>
      )
    // }else{
      // return <Loader timeout={500}/>
    // }
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create a Check: Step 1">
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