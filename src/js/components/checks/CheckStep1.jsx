import React from 'react';
import _ from 'lodash';
import router from '../../modules/router';
import forms from 'newforms';
import colors from 'seedling/colors';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import config from '../../modules/config';
import Immutable, {Record, List, Map} from 'immutable';

import {Link} from 'react-router';
import {BoundField, Button} from '../forms';
import {Toolbar, StepCounter, Loader, StatusHandler} from '../global';
import {Close, Add} from '../icons';
import {UserDataRequirement} from '../user';
import {UserActions, GroupActions} from '../../actions';
import {GroupStore, CheckStore} from '../../stores';
<<<<<<< HEAD
<<<<<<< HEAD
import CheckResponse from './CheckResponse.jsx';
=======
>>>>>>> refactor check schema to match cliff's shet
=======
import CheckResponse from './CheckResponse.jsx';
>>>>>>> a lot

const groupOptions = []

const verbOptions = ['GET','POST','PUT','DELETE','PATCH'].map(name => [name, name]);

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
  })
});

const HeaderFormSet = forms.FormSet.extend({
  form:HeaderForm,
  canDelete:true
});

const GroupForm = forms.Form.extend({
  id: forms.ChoiceField({
<<<<<<< HEAD
<<<<<<< HEAD
    label:'Target',
=======
>>>>>>> refactor check schema to match cliff's shet
=======
    label:'Target',
>>>>>>> a lot
    choices:[]
  }),
  render() {
    return(
      <div>
<<<<<<< HEAD
<<<<<<< HEAD
        <h2>Choose a Check Target</h2>
=======
        <h2>Choose an AWS Group</h2>
>>>>>>> refactor check schema to match cliff's shet
=======
        <h2>Choose a Check Target</h2>
>>>>>>> a lot
        <BoundField bf={this.boundField('id')}/>
      </div>
    )
  }
});

const InfoForm = forms.Form.extend({
  port: forms.CharField({
    widgetAttrs:{
      placeholder:'e.g. 8080',
    },
    widget:forms.NumberInput
  }),
  verb: forms.ChoiceField({
    choices:verbOptions,
    widget:forms.RadioSelect,
    label:'InlineRadioSelect',
    // initial:['GET']
  }),
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
        <h2>Define an HTTP Request</h2>
        <BoundField bf={this.boundField('port')} key={`bound-field-port`}/>
        <BoundField bf={this.boundField('verb')} key={`bound-field-verb`}/>
        <BoundField bf={this.boundField('path')} key={`bound-field-path`}/>
      </div>
    )
  }
})

const CheckStep1 = React.createClass({
  mixins:[GroupStore.mixin],
  storeDidChange(){
<<<<<<< HEAD
<<<<<<< HEAD
    const getGroupsStatus = GroupStore.getGetGroupsSecurityStatus();
    let stateObj = {};
    if(getGroupsStatus == 'success'){
      this.state.group.fields.id.setChoices(this.getGroupChoices());
      stateObj.groups = GroupStore.getGroupsSecurity();
=======
    const status = GroupStore.getGetGroupsSecurityStatus();
    if(status == 'success'){
      this.state.group.fields.id.setChoices(this.getGroupChoices());
      this.setState({
        groups:GroupStore.getGroupsSecurity()
      });
>>>>>>> refactor check schema to match cliff's shet
    }
    this.setState(_.assign(stateObj,{getGroupsStatus}));
=======
    const getGroupsStatus = GroupStore.getGetGroupsSecurityStatus();
    let stateObj = {};
    if(getGroupsStatus == 'success'){
      this.state.group.fields.id.setChoices(this.getGroupChoices());
      stateObj.groups = GroupStore.getGroupsSecurity();
    }
    this.setState(_.assign(stateObj,getGroupsStatus));
>>>>>>> a lot
  },
  getInitialState() {
    const self = this;
    const initialHeaders = this.props.check.check_spec.value.headers;
    const obj = {
      info: new InfoForm(_.extend({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
      }, self.dataComplete() ? {data:self.props.check.check_spec.value} : null)),
      headers: new HeaderFormSet({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
        emptyPermitted:false,
<<<<<<< HEAD
<<<<<<< HEAD
        initial:initialHeaders.length ? initialHeaders : null,
        // minNum:!initialHeaders.length ? 1 : 0,
=======
        initial:initialHeaders,
        minNum:!initialHeaders.length ? 1 : 0,
>>>>>>> refactor check schema to match cliff's shet
=======
        initial:initialHeaders.length ? initialHeaders : null,
        // minNum:!initialHeaders.length ? 1 : 0,
>>>>>>> and mo
        extra:0,
        validation:{
          on:'blur change',
          onChangeDelay:150
        }
      }),
      group: new GroupForm(_.extend({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      }, self.dataComplete() ? {data:{id:self.props.check.target.id}} : null)),
      check:this.props.check,
      groups:List()
=======
      }, self.dataComplete() ? {data:{id:[self.props.check.target.id]}} : null)),
=======
        label:'Target',
      }, self.dataComplete() ? {data:{id:self.props.check.target.id}} : null)),
>>>>>>> and mo
      check:this.props.check
>>>>>>> refactor check schema to match cliff's shet
=======
      }, self.dataComplete() ? {data:{id:self.props.check.target.id}} : null)),
      check:this.props.check,
      groups:List()
>>>>>>> a lot
    }
    //this is a workaround because the library is not working correctly with initial + data formset
    setTimeout(function(){
      self.state.headers.forms().forEach((form, i) => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a lot
        const h = self.props.check.check_spec.value.headers[i];
        const data = {
          key:h.name,
          value:h.values.join(', ')
        }
        form.setData(data);
<<<<<<< HEAD
=======
        form.setData(self.props.check.check_spec.value.headers[i]);
>>>>>>> refactor check schema to match cliff's shet
=======
>>>>>>> a lot
      });
    },10);
    return _.extend(obj, {
      cleanedData:null
    });
  },
  dataComplete(){
    const condition1 = this.props.check.target.id;
    const condition2 = _.chain(['port', 'verb', 'path']).map(s => this.props.check.check_spec.value[s]).every().value();
    return condition1 && condition2;
  },
  getGroupChoices(){
    let groups = GroupStore.getGroupsSecurity().toJS();
    if(config.demo){
      groups = _.filter(groups, g => {
        return g.name.match('api-opsee-com|auth tier|c1-us-west-1|nsqadmin-lb|staging');
      });
    }
    return groups.map(g => {
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
    let data = this.getFinalData();
    this.props.onChange(data, this.disabled(), 1);
  },
  removeHeader(index){
    this.state.headers.removeForm(index);
  },
  getHeaderForms(){
    return _.reject(this.state.headers.forms(), f => {
      return f.cleanedData.DELETE;
    })
  },
  renderHeaderForm(){
    return(
      <div>
        <h2>Request Headers</h2>
        {this.getHeaderForms().map((form, index) => {
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
                      <Col xs={12} sm={6} key={`header-field-${index}-key`}>
                        <BoundField bf={form.boundField('key')}/>
                      </Col>
                      <Col xs={12} sm={6} key={`header-field-${index}-value`}>
                        <BoundField bf={form.boundField('value')}/>
                      </Col>
                    </Row>
                  </Grid>
                </div>
                <BoundField bf={form.boundField('DELETE')}/>
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
  getFinalData(){
    let check = CheckStore.newCheck().toJS();
    let val = check.check_spec.value;
    val.headers = _.chain(this.state.headers.cleanedData()).reject('DELETE').map(h => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a lot
      return {
        name:h.key,
        values:h.value ? h.value.split(', ') : undefined
      }
<<<<<<< HEAD
    }).value();
    check.target = _.merge({}, check.target, this.state.group.cleanedData);
    let cleaned = this.state.info.cleanedData;
    cleaned.port = cleaned.port ? parseInt(cleaned.port, 10) : null;
    val = _.assign(val, cleaned);
    return check;
=======
      return _.omit(h, 'DELETE');
=======
>>>>>>> a lot
    }).value();
    check.target = _.merge({}, check.target, this.state.group.cleanedData);
    let cleaned = this.state.info.cleanedData;
    cleaned.port = cleaned.port ? parseInt(cleaned.port, 10) : null;
    val = _.assign(val, cleaned);
    return check;
<<<<<<< HEAD
    // return _.assign(data, this.state.info.cleanedData, {group:this.state.group.cleanedData});
>>>>>>> refactor check schema to match cliff's shet
=======
>>>>>>> and mo
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
    if(this.state.groups.size){
      return (
        <form name="checkStep1Form" ref="form" onSubmit={this.submit}>
          {this.renderHelperText()}
          {this.state.group.render()}
          {this.state.info.render()}
          {this.renderHeaderForm()}
          {this.renderSubmitButton()}
<<<<<<< HEAD
          <h2>Your Response</h2>
=======
>>>>>>> a lot
          <CheckResponse check={this.getFinalData()}/>
        </form>
      )
    }else{
      return(
        <StatusHandler status={this.state.getGroupsStatus}>
<<<<<<< HEAD
          <p>No Groups available to create a Check against.</p>
=======
          <p>No Groups Available</p>
>>>>>>> a lot
        </StatusHandler>
      );
    }
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

export default CheckStep1;