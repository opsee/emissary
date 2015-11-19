import React, {PropTypes} from 'react';
import _ from 'lodash';
import router from '../../modules/router';
import forms from 'newforms';
import colors from 'seedling/colors';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';

import {BoundField, Button} from '../forms';
import {Toolbar, StepCounter} from '../global';
import {Close, Add} from '../icons';
import {UserDataRequirement} from '../user';
import {CheckActions, GroupActions, InstanceActions, UserActions} from '../../actions';
import {GroupStore, InstanceStore} from '../../stores';
import CheckResponse from './CheckResponse.jsx';
import {GroupItem} from '../groups';
import {InstanceItem} from '../instances';
import {Padding} from '../layout';

const verbOptions = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(name => [name, name]);

const HeaderForm = forms.Form.extend({
  key: forms.CharField({
    widgetAttrs: {
      placeholder: 'e.g. content-type'
    }
  }),
  value: forms.CharField({
    widgetAttrs: {
      placeholder: 'e.g. application/json'
    }
  })
});

const HeaderFormSet = forms.FormSet.extend({
  form: HeaderForm,
  canDelete: true
});

const InfoForm = forms.Form.extend({
  port: forms.CharField({
    widgetAttrs: {
      placeholder: 'e.g. 8080'
    },
    widget: forms.NumberInput
  }),
  verb: forms.ChoiceField({
    choices: verbOptions,
    widget: forms.RadioSelect,
    widgetAttrs: {
      widgetType: 'InlineRadioSelect'
    },
    initial: ['GET']
  }),
  body: forms.CharField({
    widget: forms.Textarea,
    required: false,
    widgetAttrs: {
      widgetType: 'Textarea'
    }
  }),
  path: forms.CharField({
    widgetAttrs: {
      placeholder: 'e.g. /healthcheck'
    }
  }),
  render() {
    return (
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
    );
  }
});

const CheckCreateRequest = React.createClass({
  mixins: [GroupStore.mixin],
  propTypes: {
    check: PropTypes.object,
    renderAsInclude: PropTypes.bool,
    onChange: PropTypes.func,
    onTargetClick: PropTypes.func
  },
  getInitialState() {
    const self = this;
    const initialHeaders = _.get(this.props, 'check.check_spec.value.headers') || [];
    let initialData = _.cloneDeep(_.get(self.props, 'check.check_spec.value') || {});
    if (initialData.verb && typeof initialData.verb === 'string'){
      initialData.verb = [initialData.verb];
    }
    const obj = {
      info: new InfoForm(_.assign({
        onChange: self.runChange,
        labelSuffix: '',
        validation: {
          on: 'blur change',
          onChangeDelay: 700
        }
      }, self.isDataComplete() ? {data: initialData} : null)),
      headers: new HeaderFormSet({
        onChange: self.runChange,
        labelSuffix: '',
        emptyPermitted: false,
        initial: initialHeaders.length ? initialHeaders : null,
        // minNum:!initialHeaders.length ? 1 : 0,
        extra: 0,
        validation: {
          on: 'blur change',
          onChangeDelay: 700
        }
      }),
      check: this.props.check,
      hasSetHeaders: !self.isDataComplete()
    };
    //this is a workaround because the library is not working correctly with initial + data formset
    setTimeout(() => {
      self.state.headers.forms().forEach((form, i) => {
        const h = self.props.check.check_spec.value.headers[i];
        const data = {
          key: h.name,
          value: h.values.join(', ')
        };
        form.setData(data);
      });
      this.setState({hasSetHeaders: true});
    }, 50);
    return _.extend(obj, {
      cleanedData: null
    });
  },
  componentWillMount(){
    if (!GroupStore.getGroupsSecurity().size){
      GroupActions.getGroupsSecurity();
    }
    if (!GroupStore.getGroupsELB().size){
      GroupActions.getGroupsELB();
    }
    if (!InstanceStore.getInstancesECC().size){
      InstanceActions.getInstancesECC();
    }
    CheckActions.resetTestCheck();
  },
  componentDidMount(){
    if (this.props.renderAsInclude){
      this.runChange();
    }
  },
  storeDidChange(){
    const cond1 = GroupStore.getGetGroupsSecurityStatus() === 'success';
    const cond2 = GroupStore.getGetGroupsELBStatus() === 'success';
    const cond3 = InstanceStore.getInstancesECC() === 'success';
    if (cond1 || cond2 || cond3){
      this.forceUpdate();
    }
  },
  getHeaderForms(){
    return _.reject(this.state.headers.forms(), f => {
      return f.cleanedData.DELETE;
    });
  },
  getCheck(){
    return _.cloneDeep(this.props.check);
  },
  getFinalData(){
    let check = _.cloneDeep(this.props.check);
    let val = check.check_spec.value;
    if (this.state.hasSetHeaders){
      val.headers = _.chain(this.state.headers.cleanedData()).reject('DELETE').map(h => {
        return {
          name: h.key,
          values: h.value ? h.value.split(', ') : undefined
        };
      }).value();
    }
    let cleaned = this.state.info.cleanedData;
    if (cleaned.path && !cleaned.path.match('^\/')){
      cleaned.path = `/${cleaned.path}`;
    }
    if (cleaned.port){
      cleaned.port = parseInt(cleaned.port, 10);
    }
    val = _.assign(val, cleaned);
    return check;
  },
  isDataComplete(){
    const condition1 = this.props.check.target.id;
    const condition2 = _.chain(['port', 'verb', 'path']).map(s => this.props.check.check_spec.value[s]).some().value();
    return condition1 && condition2;
  },
  isDisabled(){
    let headersComplete = _.chain(this.getHeaderForms()).map(h => h.isComplete()).every().value();
    return !(this.state.info.isComplete() && headersComplete);
  },
  runChange(){
    let data = this.getFinalData();
    this.props.onChange(data, this.isDisabled(), 1);
  },
  runDismissHelperText(){
    UserActions.userPutUserData('hasDismissedCheckRequestHelp');
  },
  handleSubmit(e){
    e.preventDefault();
    router.transitionTo('checkCreateAssertions');
  },
  handleTargetClick(){
    router.transitionTo('checkCreateTarget');
  },
  renderHeaderForm(){
    return (
      <div>
        <h3>Request Headers</h3>
        {this.getHeaderForms().map((form, index) => {
          return (
            <Padding b={2} key={`header-form-${index}`}>
              <Grid fluid>
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
          );
        })
        }
        <Button flat color="primary" onClick={this.state.headers.addAnother.bind(this.state.headers)}>
          <Add fill={colors.primary} inline/> Add {!this.state.headers.forms().length ? 'A' : 'Another'} Header
        </Button>
      </div>
    );
  },
  renderSubmitButton(){
    if (!this.props.renderAsInclude){
      return (
        <div>
          <Padding tb={1}/>
          <Button color="success" block type="submit" onClick={this.handleSubmit} disabled={this.isDisabled()} title={this.isDisabled() ? 'Complete the form to move on.' : 'Define Assertions'} chevron>Next: Define Assertions</Button>
          <StepCounter active={2} steps={4}/>
        </div>
      );
    }
    return <div/>;
  },
  renderLink(){
    return this.state.check.id ? (
      <Button color="primary" fab to={`/check/${this.state.check.id}`} params={{id: this.state.check.id}} title="Edit {check.name}"/>
      ) : <div/>;
  },
  renderTargetSelection(){
    let selection = GroupStore.getGroupFromFilter(this.props.check.target);
    if (!selection){
      selection = InstanceStore.getInstanceFromFilter(this.props.check.target);
    }
    if (selection && selection.get('id')){
      if (this.props.check.target.type.match('EC2|instance')){
        return (
          <InstanceItem item={selection} noBorder linkInsteadOfMenu onClick={this.handleTargetClick} title="Return to target selection"/>
        );
      }
      return (
        <GroupItem item={selection} noBorder linkInsteadOfMenu onClick={this.handleTargetClick} title="Return to target selection"/>
      );
    }
    return <div/>;
  },
  renderHelperText(){
    return (
        <UserDataRequirement hideIf="hasDismissedCheckRequestHelp">
          <Alert bsStyle="success" onDismiss={this.runDismissHelperText}>
            <p>Your Request defines the check you want to run on your chosen target. You can try a typical HTTP request by choosing to GET the '/' route on port 80.</p>
          </Alert>
        </UserDataRequirement>
      );
  },
  renderBodyInput(){
    if (this.state.info.cleanedData.verb !== 'GET'){
      return (
        <Padding b={1}>
          <BoundField bf={this.state.info.boundField('body')} key={`bound-field-body`}/>
        </Padding>
      );
    }
    return <div/>;
  },
  renderInfoForm(){
    return (
      <div>
        <h3>Define Your HTTP Request</h3>
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
    );
  },
  renderInner(){
    return (
      <form name="checkCreateRequestForm" ref="form" onSubmit={this.handleSubmit}>
        <Padding b={1}>
          {this.renderHelperText()}
        </Padding>
        <Padding b={1}>
          <h3>Your Target</h3>
          {this.renderTargetSelection()}
          <hr/>
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
          <Button to="/" icon flat>
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderInner()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  },
  render() {
    return this.props.renderAsInclude ? this.renderInner() : this.renderAsPage();
  }
});

export default CheckCreateRequest;