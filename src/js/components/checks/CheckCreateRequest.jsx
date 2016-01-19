import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import colors from 'seedling/colors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {BoundField, Button} from '../forms';
import {BastionRequirement, Toolbar} from '../global';
import {Close, Add} from '../icons';
import {UserDataRequirement} from '../user';
import CheckResponsePaginate from './CheckResponsePaginate.jsx';
import {GroupItem} from '../groups';
import {InstanceItem} from '../instances';
import {Padding} from '../layout';
import {Heading} from '../type';
import {
  env as envActions,
  checks as checkActions,
  user as userActions
} from '../../actions';

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
  protocol: forms.ChoiceField({
    choices: ['http', 'https'].map(name => [name, name]),
    widget: forms.RadioSelect,
    widgetAttrs: {
      widgetType: 'InlineRadioSelect'
    },
    initial: ['http']
  }),
  verb: forms.ChoiceField({
    choices: verbOptions,
    widget: forms.RadioSelect,
    label: 'Method',
    widgetAttrs: {
      widgetType: 'InlineRadioSelect'
    },
    initial: ['GET']
  }),
  port: forms.CharField({
    widgetAttrs: {
      placeholder: 'e.g. 8080'
    },
    widget: forms.NumberInput
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
  constructor(data, kwargs){
    forms.Form.call(this, kwargs);
  }
});

const CheckCreateRequest = React.createClass({
  propTypes: {
    check: PropTypes.object,
    renderAsInclude: PropTypes.bool,
    onChange: PropTypes.func,
    onTargetClick: PropTypes.func,
    envActions: PropTypes.shape({
      getGroupsSecurity: PropTypes.func,
      getGroupsElb: PropTypes.func,
      getInstancesEcc: PropTypes.func
    }),
    checkActions: PropTypes.shape({
      testCheckReset: PropTypes.func
    }),
    userActions: PropTypes.shape({
      putData: PropTypes.func
    }),
    history: PropTypes.object,
    redux: PropTypes.shape({
      env: PropTypes.shape({
        instances: PropTypes.object,
        groups: PropTypes.object
      })
    })
  },
  getInitialState() {
    const self = this;
    const initialHeaders = _.get(this.props, 'check.check_spec.value.headers') || [];
    let initialData = _.cloneDeep(_.get(self.props, 'check.check_spec.value') || {});
    if (typeof initialData.verb === 'string'){
      initialData.verb = [initialData.verb];
    }
    if (typeof initialData.protocol === 'string'){
      initialData.protocol = [initialData.protocol];
    }
    initialData = _.mapValues(initialData, val => {
      return val || null;
    });
    const obj = {
      info: new InfoForm(initialData, _.assign({
        onChange: self.runChange,
        labelSuffix: '',
        validation: {
          on: 'blur change',
          onChangeDelay: 700
        },
        initial: self.isDataComplete() ? initialData : null
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
      if (this.isMounted()){
        this.setState({hasSetHeaders: true});
      }
    }, 50);
    return _.extend(obj, {
      cleanedData: null
    });
  },
  componentWillMount(){
    if (!this.props.check.target.id){
      return this.props.history.pushState(null, '/check-create/target');
    }
    this.props.checkActions.testCheckReset();
  },
  componentDidMount(){
    if (this.props.renderAsInclude){
      this.runChange();
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
    const condition2 = _.chain(['port', 'path']).map(s => this.props.check.check_spec.value[s]).some().value();
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
    this.props.userActions.putData('hasDismissedCheckRequestHelp');
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.history.pushState(null, '/check-create/assertions');
  },
  handleTargetClick(){
    this.props.history.pushState(null, '/check-create/target');
  },
  renderHeaderForm(){
    return (
      <div>
        <Heading level={3}>Request Headers</Heading>
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
                    <Padding t={3}>
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
          <Button color="success" block type="submit" disabled={this.isDisabled()} title={this.isDisabled() ? 'Complete the form to move on.' : 'Define Assertions'} chevron>Next: Define Assertions</Button>
        </div>
      );
    }
    return null;
  },
  renderLink(){
    return this.state.check.id ? (
      <Button color="primary" fab to={`/check/${this.state.check.id}`} title="Edit {check.name}"/>
      ) : <div/>;
  },
  renderTargetSelection(){
    let selection;
    const target = this.props.check.target;
    let type = target.type;
    if (!type){
      return null;
    }
    type = type === 'sg' ? 'security' : type;
    if (type.match('security|elb')){
      selection = this.props.redux.env.groups[type].find(g => {
        return g.get('id') === target.id;
      }) || new Map();
    }else {
      selection = this.props.redux.env.instances.ecc.find(g => {
        return g.get('id') === target.id;
      }) || new Map();
    }
    if (selection && selection.get('id')){
      if (type.match('EC2|instance')){
        return (
          <InstanceItem item={selection} noBorder linkInsteadOfMenu onClick={this.handleTargetClick} title="Return to target selection"/>
        );
      }
      return (
        <GroupItem item={selection} noBorder linkInsteadOfMenu onClick={this.handleTargetClick} title="Return to target selection"/>
      );
    }
    return null;
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
    return null;
  },
  renderInfoForm(){
    const self = this;
    return (
      <div>
        <Heading level={3}>Define Your HTTP Request</Heading>
        {['protocol', 'verb', 'path', 'port'].map(string => {
          return (
            <Padding b={1}>
              <BoundField bf={self.state.info.boundField(string)} key={`bound-field-${string}`}/>
            </Padding>
          );
        })}
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
          <Heading level={3}>Your Target</Heading>
          {this.renderTargetSelection()}
          <hr/>
        </Padding>
        <Padding b={1}>
          {this.renderInfoForm()}
          {this.renderHeaderForm()}
        </Padding>
        <hr/>
        <Padding b={1}>
          <CheckResponsePaginate check={this.getCheck()} showBoolArea={false}/>
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
              <BastionRequirement>
                {this.renderInner()}
              </BastionRequirement>
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

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  envActions: bindActionCreators(envActions, dispatch),
  checkActions: bindActionCreators(checkActions, dispatch),
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckCreateRequest);