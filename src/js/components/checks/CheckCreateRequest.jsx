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
        <h2>Choose a Check Target</h2>
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
    label:'InlineRadioSelect'
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

const CheckCreateRequest = React.createClass({
  mixins:[GroupStore.mixin],
  storeDidChange(){
    this.forceUpdate();
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
        initial:initialHeaders.length ? initialHeaders : null,
        // minNum:!initialHeaders.length ? 1 : 0,
        extra:0,
        validation:{
          on:'blur change',
          onChangeDelay:150
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
    let check = _.cloneDeep(this.props.check);
    let val = check.check_spec.value;
    val.headers = _.chain(this.state.headers.cleanedData()).reject('DELETE').map(h => {
      return {
        name:h.key,
        values:h.value ? h.value.split(', ') : undefined
      }
    }).value();
    let cleaned = this.state.info.cleanedData;
    cleaned.port = cleaned.port ? parseInt(cleaned.port, 10) : null;
    val = _.assign(val, cleaned);
    return check;
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
  renderTargetSelection(){
    const selection = GroupStore.getGroupsSecurity().filter(group => group.get('id') == this.props.check.target.id).get(0);
    if(selection){
      return (
        <div>
          <h2>Target</h2>
          <GroupItem item={selection}/>
        </div>
      )
    }else{
      return <div/>
    }
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
    return (
      <form name="checkCreateRequestForm" ref="form" onSubmit={this.submit}>
        {this.renderHelperText()}
        {this.renderTargetSelection()}
        <div><br/></div>
        {this.state.info.render()}
        {this.renderHeaderForm()}
        {this.renderSubmitButton()}
        <h2>Your Response</h2>
        <CheckResponse check={this.getFinalData()}/>
      </form>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title="Create a Check: Define Request">
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

export default CheckCreateRequest;