import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import {plain as seed} from 'seedling';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Map} from 'immutable';
import {Address6, Address4} from 'ip-address';
import URI from 'uri-js';

import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {BoundField, Button} from '../forms';
import {BastionRequirement, Toolbar} from '../global';
import {Close, Add} from '../icons';
import {UserDataRequirement} from '../user';
import CheckResponsePaginate from './CheckResponsePaginate.jsx';
import CheckDisabledReason from './CheckDisabledReason.jsx';
import {GroupItem} from '../groups';
import {InstanceItem} from '../instances';
import {Padding} from '../layout';
import {Heading} from '../type';
import {validate} from '../../modules';
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
    //allows user to edit target in /check/edit mode
    handleTargetClick: PropTypes.func,
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
    const {check} = this.props;
    let initialHeaders = _.get(this.props, 'check.check_spec.value.headers') || [];
    initialHeaders = initialHeaders.map(h => {
      return {
        key: h.name,
        value: h.values.join(', ')
      };
    });

    let initialData = _.cloneDeep(_.get(self.props, 'check.check_spec.value') || {});
    if (typeof initialData.verb === 'string'){
      initialData.verb = [initialData.verb];
    }
    if (typeof initialData.protocol === 'string'){
      initialData.protocol = [initialData.protocol];
    }
    if (check.target.type === 'host' && check.target.id){
      const s = check.check_spec.value;
      let port = '';
      if (s.protocol === 'http' && s.port !== 80){
        port = `:${s.port}`;
      } else if (s.protocol === 'https' && s.port !== 443){
        port = `:${s.port}`;
      }
      initialData.url = `${s.protocol}://${check.target.id}${port}${s.path}`;
    }
    initialData = _.mapValues(initialData, val => {
      return val || null;
    });

    const infoForm = this.getInfoFormConstructor();
    const obj = {
      info: new infoForm(initialData, _.assign({
        onChange: self.runChange,
        labelSuffix: '',
        validation: {
          on: 'blur change',
          onChangeDelay: 700
        },
        initial: self.isDataComplete() ? initialData : null
      })),
      headers: new HeaderFormSet({
        onChange: self.runChange,
        labelSuffix: '',
        emptyPermitted: false,
        initial: initialHeaders.length ? initialHeaders : null,
        extra: 0,
        validation: {
          on: 'blur change',
          onChangeDelay: 700
        }
      }),
      check,
      hasSetHeaders: !self.isDataComplete()
    };
    //this is a workaround because the library is not working correctly with initial + data formset
    setTimeout(() => {
      self.state.headers.forms().forEach((form, i) => {
        form.setData(initialHeaders[i]);
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
    if (!this.props.check.target.id && this.props.check.target.type !== 'host'){
      return this.props.history.pushState(null, '/check-create/target');
    }
    return this.props.checkActions.testCheckReset();
  },
  componentDidMount(){
    if (this.props.renderAsInclude){
      this.runChange();
    }
  },
  getInfoFormConstructor(){
    const isHost = this.props.check.target.type === 'host';
    return forms.Form.extend({
      protocol: forms.ChoiceField({
        choices: ['http', 'https'].map(name => [name, name]),
        widget: forms.RadioSelect,
        required: !isHost,
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
        required: !isHost,
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
        label: 'Path',
        required: !isHost,
        widgetAttrs: {
          placeholder: '/healthcheck'
        }
      }),
      url: forms.CharField({
        label: 'URL',
        required: isHost,
        widgetAttrs: {
          placeholder: 'https://superwebsite.com'
        }
      }),
      constructor(data, kwargs){
        forms.Form.call(this, kwargs);
      }
    });
  },
  getHeaderForms(){
    return _.reject(this.state.headers.forms(), f => {
      return f.cleanedData.DELETE;
    });
  },
  getCheck(){
    return _.cloneDeep(this.props.check);
  },
  getFinalHeaders(){
    return _.chain(this.getHeaderForms()).map(header => {
      const h = header.cleanedData || {};
      return {
        name: h.key,
        values: h.value ? h.value.split(', ') : []
      };
    }).value();
  },
  getFinalData(){
    let check = _.cloneDeep(this.props.check);
    let override = {};
    if (this.state.hasSetHeaders){
      override.headers = this.getFinalHeaders();
    }
    if (this.props.check.target.type === 'host'){
      const string = this.state.info.data.url || '';
      try {
        const url = new window.URL(string);
        override = _.assign(override, {
          port: parseInt(url.port, 10) || (url.protocol === 'https:' ? 443 : 80),
          path: url.path || '/',
          protocol: (url.protocol || '').replace(':', '')
        });
        check.target.id = url.hostname;
      } catch (err) {
        let address = URI.parse(string);
        debugger;
        // string is not a domain-like url, try ipv4
        address = new Address4(string);
        if (address.isValid()){
          override = _.assign(override, {
            port: 80,
            path: null
          });
          debugger;
        } else {
          //string is not ipv4, try ipv6
          address = new Address6(string);
          debugger;
        }
      }
    }
    let data = _.assign({}, this.state.info.data, override);
    if (data.path && !data.path.match('^\/')){
      data.path = `/${data.path}`;
    }
    if (data.port){
      data.port = parseInt(data.port, 10);
    }
    if (Array.isArray(data.protocol)){
      data.protocol = data.protocol[0];
    }
    if (Array.isArray(data.verb)){
      data.verb = data.verb[0];
    }
    check.check_spec.value = _.chain(check.check_spec.value)
    .assign(data)
    .pick(['name', 'path', 'port', 'verb', 'protocol', 'headers'])
    .value();
    return check;
  },
  isDataComplete(){
    const condition1 = this.props.check.target.id;
    const condition2 = _.chain(['port', 'path']).map(s => this.props.check.check_spec.value[s]).some().value();
    return condition1 && condition2;
  },
  isDisabled(){
    return !!validate.check(this.props.check, ['request']).length;
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
    if (!this.props.renderAsInclude){
      const data = JSON.stringify(this.props.check);
      this.props.history.pushState(null, `/check-create/assertions?data=${data}`);
    }
  },
  handleTargetClick(){
    if (!this.props.renderAsInclude){
      this.props.history.pushState(null, '/check-create/target');
    } else if (typeof this.props.handleTargetClick === 'function'){
      this.props.handleTargetClick();
    }
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
          <Add fill={seed.color.primary} inline/> Add {!this.state.headers.forms().length ? 'A' : 'Another'} Header
        </Button>
      </div>
    );
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
    } else {
      selection = this.props.redux.env.instances.ecc.find(g => {
        return g.get('id') === target.id;
      }) || new Map();
    }
    if (selection && selection.get('id')){
      let inner = null;
      if (type.match('^EC2$|^ecc$|^instance$')){
        inner = <InstanceItem item={selection} noBorder linkInsteadOfMenu onClick={this.handleTargetClick} title="Return to target selection"/>;
      }
      inner = <GroupItem item={selection} noBorder linkInsteadOfMenu onClick={this.handleTargetClick} title="Return to target selection"/>;
      return (
        <Padding b={1}>
          <Heading level={3}>Your Target</Heading>
          {inner}
          <hr/>
        </Padding>
      );
    }
    return null;
  },
  renderHelperText(){
    return (
        <UserDataRequirement hideIf="hasDismissedCheckRequestHelp">
          <Alert bsStyle="success" onDismiss={this.runDismissHelperText}>
            <p>Next, specify the parameters of your request. A typical request might be a GET at route '/' on port 80.</p>
          </Alert>
        </UserDataRequirement>
      );
  },
  renderBodyInput(){
    if (this.state.info.cleanedData.verb !== 'GET'){
      return (
        <Padding b={1}>
          <BoundField bf={this.state.info.boundField('body')} key="bound-field-body"/>
        </Padding>
      );
    }
    return null;
  },
  renderInfoForm(){
    const self = this;
    return (
      <Padding b={1}>
        <Heading level={3}>Define Your HTTP Request</Heading>
        {_.chain(['protocol', 'verb', 'path', 'url', 'port'])
        .reject(field => {
          if (this.props.check.target.type === 'host'){
            return field.match('protocol|port|path');
          }
          return field === 'url';
        })
        .value().map(string => {
          return (
            <Padding b={1} key={`form-input-${string}`}>
              <BoundField bf={self.state.info.boundField(string)} key={`bound-field-${string}`}/>
            </Padding>
          );
        })}
        {this.renderBodyInput()}
      </Padding>
    );
  },
  renderSubmitButton(){
    if (!this.props.renderAsInclude){
      return (
        <div>
          <Padding tb={1}/>
          <Button color="success" block type="submit" disabled={this.isDisabled()} title="Define Assertions" chevron>Next: Define Assertions</Button>
          <CheckDisabledReason check={this.getCheck()} areas={['request']}/>
        </div>
      );
    }
    return null;
  },
  renderInner(){
    return (
      <form name="checkCreateRequestForm" ref="form" onSubmit={this.handleSubmit}>
        <Padding b={2}>
          {this.renderHelperText()}
        </Padding>
        {this.renderTargetSelection()}
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
        <Toolbar btnPosition="midRight" title="Create Check (3 of 5)" bg="info">
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