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
import CheckResponse from './CheckResponse.jsx';
import {GroupItem} from '../groups';
import {Padding} from '../layout';

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
    label:'Target',
    choices:[]
  }),
  render() {
    return(
      <div>
        <h3>Choose a Check Target</h3>
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
    widgetAttrs:{
      widgetType:'InlineRadioSelect'
    },
    initial:['GET']
  }),
  body:forms.CharField({
    widget: forms.Textarea,
    required:false
  }),
  path: forms.CharField({
    widgetAttrs:{
      placeholder:'e.g. /healthcheck'
    }
  }),
  render() {
    return(
      <div>
        <h3>Define HTTP Request</h3>
        <Padding b={1}>
          <BoundField bf={this.boundField('verb')} key={`bound-field-verb`}/>
        </Padding>
        <Padding b={1}>
          <BoundField bf={this.boundField('path')} key={`bound-field-path`}/>
        </Padding>
        <Padding b={1}>
          <BoundField bf={this.boundField('port')} key={`bound-field-port`}/>
        </Padding>
        <Padding b={1}>
          <BoundField bf={this.boundField('body')} key={`bound-field-body`}/>
        </Padding>
      </div>
    )
  }
})

const CheckCreateRequest = React.createClass({
  mixins:[GroupStore.mixin],
  storeDidChange(){
    const cond1 = GroupStore.getGetGroupsSecurityStatus() == 'success';
    const cond2 = GroupStore.getGetGroupsELBStatus() == 'success';
    if(cond1 || cond2){
      this.forceUpdate();
    }
  },
  getInitialState() {
    const self = this;
    const initialHeaders = this.props.check.check_spec.value.headers;
    const obj = {
      info: new InfoForm(_.extend({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
        validation:{
          on:'blur change',
          onChangeDelay:700
        }
      }, self.dataComplete() ? {data:self.props.check.check_spec.value} : null)),
      headers: new HeaderFormSet({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
        emptyPermitted:false,
        initial:initialHeaders.length ? initialHeaders : null,
        // minNum:!initialHeaders.length ? 1 : 0,
        extra:0,
        validation:{
          on:'blur change',
          onChangeDelay:700
        }
      }),
      check:this.props.check,
    }
    //this is a workaround because the library is not working correctly with initial + data formset
    setTimeout(function(){
      self.state.headers.forms().forEach((form, i) => {
        const h = self.props.check.check_spec.value.headers[i];
        const data = {
          key:h.name,
          value:h.values.join(', ')
        }
        form.setData(data);
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
  componentWillMount(){
    const groups = GroupStore.getGroupsSecurity();
    if(!groups.size){
      GroupActions.getGroupsSecurity();
    }
    const groupsELB = GroupStore.getGroupsELB();
    if(!groupsELB.size){
      GroupActions.getGroupsELB();
    }
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
        <h3>Request Headers</h3>
        {this.getHeaderForms().map((form, index) => {
          return (
            <Padding b={2} key={`header-form-${index}`}>
              <Grid fluid={true}>
                <Row>
                  <Col xs={12} sm={5} key={`header-field-${index}-key`}>
                    <BoundField bf={form.boundField('key')}/>
                  </Col>
                  <Col xs={10} sm={5} key={`header-field-${index}-value`}>
                    <BoundField bf={form.boundField('value')}/>
                  </Col>
                  <Col xs={2}>
                    <Padding t={2}>
                      <BoundField bf={form.boundField('DELETE')}/>
                    </Padding>
                  </Col>
                </Row>
              </Grid>
            </Padding>
          )
        })
        }
        <Button flat={true} color="primary" onClick={this.state.headers.addAnother.bind(this.state.headers)}>
          <Add fill={colors.primary} inline={true}/> Add {!this.state.headers.forms().length ? 'A' : 'Another'} Header
        </Button>
      </div>
    )
  },
  getFinalData(){
    let check = _.clone(this.props.check);
    let val = check.check_spec.value;
    val.headers = _.chain(this.state.headers.cleanedData()).reject('DELETE').map(h => {
      return {
        name:h.key,
        values:h.value ? h.value.split(', ') : undefined
      }
    }).value();
    let cleaned = this.state.info.cleanedData;
    if(cleaned.port){
     cleaned.port = parseInt(cleaned.port, 10);
    }
    val = _.assign(val, cleaned);
    return check;
  },
  renderSubmitButton(){
    if(!this.props.renderAsInclude){
      return(
        <div>
          <Padding tb={1}></Padding>
          <Button color="success" block={true} type="submit" onClick={this.submit} disabled={this.disabled()} title={this.disabled() ? 'Complete the form to move on.' : 'Define Assertions'} chevron={true}>Next: Define Assertions</Button>
          <StepCounter active={2} steps={4}/>
        </div>
      )
    }else{
      return <div/>
    }
  },
  renderLink(){
    return this.state.check.id ? (
      <Button color="primary" fab={true} to="check" params={{id:this.state.check.id}} title="Edit {check.name}"/>
      ) : <div/>;
  },
  renderTargetSelection(){
    const selection = GroupStore.getGroupFromFilter(this.props.check.target);
    if(selection && selection.get('id')){
      return (
        <div>
          <h3>Your Target</h3>
          <GroupItem item={selection} noBorder={true} linkInsteadOfMenu={true} onClick={this.props.onTargetClick} title="Return to target selection"/>
          <hr/>
        </div>
      )
    }else{
      return <div/>
    }
  },
  submit(e){
    e.preventDefault();
    router.transitionTo('checkCreateAssertions');
  },
  disabled(){
    let headersComplete = _.chain(this.getHeaderForms()).map(h => h.isComplete()).every().value();
    return !(this.state.info.isComplete() && headersComplete);
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
  getCheck(){
    return _.cloneDeep(this.props.check);
  },
  renderBodyInput(){
    if(this.state.info.cleanedData.verb != ['GET']){
      return (
        <Padding b={1}>
          <BoundField bf={this.state.info.boundField('body')} key={`bound-field-body`}/>
        </Padding>
      )
    }else{
      return <div/>
    }
  },
  renderInfoForm(){
    return (
      <div>
        <h3>Define HTTP Request</h3>
        <Padding b={1}>
          <BoundField bf={this.state.info.boundField('verb')} key={`bound-field-verb`}/>
        </Padding>
        <Padding b={1}>
          <BoundField bf={this.state.info.boundField('path')} key={`bound-field-path`}/>
        </Padding>
        <Padding b={1}>
          <BoundField bf={this.state.info.boundField('port')} key={`bound-field-port`}/>
        </Padding>
        {this.renderBodyInput()}
      </div>
    )
  },
  innerRender(){
    return (
      <form name="checkCreateRequestForm" ref="form" onSubmit={this.submit}>
        {this.renderHelperText()}
        <Padding b={1}>
          {this.renderTargetSelection()}
        </Padding>
        <Padding b={1}>
          {this.renderInfoForm()}
          {this.renderHeaderForm()}
        </Padding>
        <hr/>
        <Padding b={1}>
          <h3>Your Response</h3>
          <CheckResponse check={this.getCheck()}/>
        </Padding>
        <Padding b={1}>
          {this.renderSubmitButton()}
        </Padding>
      </form>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create Check (2 of 4)" bg="info">
          <Button to="checks" icon={true} flat={true}>
            <Close btn={true}/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
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

export default CheckCreateRequest;