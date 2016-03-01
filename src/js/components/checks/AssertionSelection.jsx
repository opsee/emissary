import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {BoundField, Button} from '../forms';
import {Add, Checkmark, ChevronRight, Cloud, Delete, Mail, Slack} from '../icons';
import {Padding} from '../layout';
import {Heading} from '../type';
import {SlackConnect} from '../integrations';
import {flag, storage} from '../../modules';
import style from './assertionSelection.css';
import {
  integrations as actions
} from '../../actions';

const EmailForm = forms.Form.extend({
  text: forms.CharField({
    validators: [forms.validators.validateEmail],
    label: 'Email',
    widgetAttrs: {
      placeholder: 'address@domain.com',
      autoCapitalize: 'off',
      autoCorrect: 'off'
    }
  }),
  render() {
    return (
      <BoundField bf={this.boundField('text')}>
        <Mail className="icon"/>
      </BoundField>
    );
  }
});

const WebhookForm = forms.Form.extend({
  text: forms.CharField({
    validators: [forms.validators.URLValidator({
      schemes: ['http', 'https']
    })],
    label: 'Webhook URL',
    widgetAttrs: {
      placeholder: 'https://alert.me/incoming',
      autoCapitalize: 'off',
      autoCorrect: 'off'
    }
  }),
  render() {
    return (
      <BoundField bf={this.boundField('text')}>
        <Cloud className="icon"/>
      </BoundField>
    );
  }
});

const AssertionsSelection = React.createClass({
  propTypes: {
    check: PropTypes.object,
    assertions: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    redux: PropTypes.shape({
      user: PropTypes.object,
      integrations: PropTypes.shape({
        slackChannels: PropTypes.object,
        tests: PropTypes.array
      }).isRequired,
      asyncActions: PropTypes.shape({
        checkCreate: PropTypes.object
      })
    })
  },
  getDefaultProps() {
    return {
      assertions: []
    };
  },
  getInitialState() {
    return {
      assertions: []
    };
  },
  componentDidMount(){
    if (this.props.assertions.length){
      const assertions = this.props.assertions.map((n, i) => {
        return this.getNewSchema(n.type, i, n.value);
      });
      this.runChange(assertions);
    }
  },
  getNewSchema(type, assertionIndex, value){
    const self = this;
    const opts = {
      onChange(){
        self.handleInputChange(this.cleanedData, assertionIndex);
        self.forceUpdate();
      },
      labelSuffix: '',
      prefix: `assertion-${assertionIndex}`,
      validation: {
        on: 'blur change',
        onChangeDelay: 300
      },
      initial: value ? {
        text: value
      } : {}
    };
    return {
      type,
      value,
      form: type === 'email' ? new EmailForm(opts) : new WebhookForm(opts),
      sending: false
    };
  },
  getAssertionValueForDisplay(assertion = {}){
    if (assertion.type === 'slack_bot'){
      const channels = this.props.redux.integrations.slackChannels.toJS();
      return _.chain(channels).find(c => c.id === assertion.value).get('name').value();
    }
    return assertion.value;
  },
  getFinalAssertions(assertions = this.state.assertions){
    return assertions.map(n => _.pick(n, ['type', 'value']));
  },
  isAssertionComplete(assertion){
    return _.chain(assertion).pick(['type', 'value']).values().every().value();
  },
  runSetAssertionsState(iteratee){
    const assertions = this.state.assertions.map(iteratee);
    this.setState({
      assertions
    });
    return assertions;
  },
  runChange(assertions = this.state.assertions){
    this.setState({
      assertions
    });
    this.props.onChange(this.getFinalAssertions(assertions));
  },
  runSetType(index, type){
    this.runSetAssertionsState((n, i) => {
      return _.assign({}, n, {
        type: index === i ? type : n.type
      });
    });
  },
  runSetValue(index, data, e){
    if (e){
      e.preventDefault();
    }
    const assertions = this.runSetAssertionsState((n, i) => {
      const value = data || n.valueState;
      return _.assign({}, n, {
        value: index === i ? value : n.value
      });
    }, true);
    this.props.onChange(this.getFinalAssertions(assertions));
  },
  runRemoveType(index){
    this.runSetAssertionsState((n, i) => {
      return _.assign({}, n, {
        type: index === i ? undefined : n.type
      });
    });
  },
  runNewAssertion(type, value){
    const assertions = this.state.assertions.concat([
      this.getNewSchema(type, this.state.assertions.length, value)
    ]);
    this.runChange(assertions);
  },
  runDelete(index){
    const assertions = _.reject(this.state.assertions, (n, i) => i === index);
    this.runChange(assertions);
  },
  runTestAssertion(assertion){
    this.props.actions.testAssertionication(_.pick(assertion, ['type', 'value']));
    const assertions = this.state.assertions.map(n => {
      return _.assign({}, n, {
        sending: n.type === assertion.type && n.value === assertion.value
      });
    });
    this.runChange(assertions);
  },
  handleInputChange(data, index){
    const assertions = this.runSetAssertionsState((n, i) => {
      return _.assign({}, n, {
        value: index === i ? data.text : n.value
      });
    });
    this.props.onChange(this.getFinalAssertions(assertions));
  },
  handleSubmit(e){
    e.preventDefault();
    return false;
  },
  renderValueOrChannels(form){
    if (form.cleanedData.type === 'email'){
      return <BoundField bf={form.boundField('value')}/>;
    }
    return <BoundField bf={form.boundField('channel')}/>;
  },
  renderAssertionIcon(assertion, props = {}){
    const {type} = assertion;
    let el = <Mail {...props}/>;
    if (type === 'slack_bot' || type === 'slack'){
      el = <Slack {...props}/>;
    } else if (type === 'webhook'){
      el = <Cloud {...props}/>;
    }
    return (
      <span title={assertion.type}>{el}</span>
    );
  },
  renderDeleteButton(index){
    return (
      <Button flat color="danger" title="Remove this Assertionication" onClick={this.runDelete.bind(null, index)} style={{minHeight: '46px'}}>
        <Delete inline fill="danger"/>
      </Button>
    );
  },
  renderTestButton(assertion, props){
    let string = 'test';
    const found = _.find(this.props.redux.integrations.tests, _.pick(assertion, ['type', 'value']));
    if (found){
      string = found.success ? 'sent' : 'error';
    }
    let color = 'warning';
    if (string === 'sent'){
      color = 'success';
    } else if (string === 'error'){
      color = 'danger';
    }
    const disabled = !this.isAssertionComplete(assertion) || !!(string.match('sent|error')) || assertion.sending;
    const className = assertion.type === 'slack_bot' ? style.testButtonSlack : style.testButton;
    let icon = <ChevronRight inline fill={disabled ? 'text' : 'warning'}/>;
    if (string === 'sent'){
      icon = <Checkmark inline fill="text"/>;
    }
    return (
      <div className="align-self-end">
        <Button color={color} flat onClick={this.runTestAssertion.bind(this, assertion)} className={className} {...props} disabled={disabled} style={{minHeight: '46px'}}>
          {string}&nbsp;{icon}
        </Button>
      </div>
    );
  },
  renderTextAssertion(assertion, index){
    return (
      <div className={style.line}>
        <Padding b={1} className={`display-flex ${style.inputArea}`}>
          <form name={`assertion-email-form-${index}`} onSubmit={this.handleSubmit} className="flex-1">
            {assertion.form.render()}
          </form>
          <Padding l={1} className="align-self-end">
            {this.renderDeleteButton(index)}
          </Padding>
        </Padding>
        {this.renderTestButton(assertion)}
      </div>
    );
  },
  renderSlackConnect(assertion, index){
    return (
      <div className="display-flex">
        <Padding r={2} className="flex-1">
          <SlackConnect target="_blank"/> to choose your channel.
        </Padding>
        <div className="align-self-start">
          {this.renderDeleteButton(index, {minHeight: '46px'})}
        </div>
      </div>
    );
  },
  renderChannelSelect(assertion, index){
    const channels = this.props.redux.integrations.slackChannels.toJS();
    return (
      <div>
        <Heading level={4}>Slack Channel</Heading>
        <div className="display-flex">
          <div className="flex-1">
            {channels.map(c => {
              return (
                <Button flat nocap onClick={this.runSetValue.bind(this, index, c.id)} color="text" style={{margin: '0 .5rem 1rem'}} key={`slack-channel-${c.id}`}>#{c.name}</Button>
              );
            })}
            </div>
            <div className="align-self-start">
              {this.renderDeleteButton(index, {minHeight: '46px'})}
            </div>
        </div>
      </div>
    );
  },
  renderChosenChannel(assertion, index){
    return (
      <div>
        <Heading level={4}>Slack Channel</Heading>
        <div className="display-flex flex-vertical-align">
          <div className="flex-1">
            <div className="display-flex">
              {this.renderAssertionIcon(assertion)}&nbsp;{this.getAssertionValueForDisplay(assertion)}
            </div>
          </div>
          {this.renderDeleteButton(index)}
          {this.renderTestButton(assertion)}
        </div>
      </div>
    );
  },
  renderAssertion(assertion, index){
    const {type} = assertion;
    const isText = !!type.match('email|webhook');
    if (!assertion.value || isText){
      if (isText){
        return this.renderTextAssertion(assertion, index);
      }
      if (type === 'slack_bot'){
        if (this.props.redux.integrations.slackChannels.toJS().length){
          return this.renderChannelSelect(assertion, index);
        }
        return this.renderSlackConnect(assertion, index);
      }
    }
    return this.renderChosenChannel(assertion, index);
  },
  renderAssertionPickType(){
    return (
      <div>
        {['email', 'slack', 'webhook'].map(type => {
          const typeCorrected = type === 'slack' ? 'slack_bot' : type;
          if (flag(`assertion-type-${type}`)){
            return (
              <Button flat color="primary" onClick={this.runNewAssertion.bind(null, typeCorrected)} className="flex-1" style={{margin: '0 1rem 1rem 0'}} key={`assertion-button-${type}`}>
                <Add inline fill="primary"/>&nbsp;{_.capitalize(type)}&nbsp;{this.renderAssertionIcon({type}, {inline: true, fill: 'primary'})}
              </Button>
            );
          }
          return null;
        })}
      </div>
    );
  },
  renderAssertionList(){
    if (this.state.assertions.length){
      return this.state.assertions.map((assertion, index) => {
        return (
          <div key={`assertion-${index}`}>
            {this.renderAssertion(assertion, index)}
            <hr/>
          </div>
        );
      });
    }
    return (
      <div>
        <p>Choose from the options below to set up assertions for this check.</p>
        <hr/>
      </div>
    );
  },
  render(){
    return (
      <Padding b={2}>
        <Heading level={3}>Assertions</Heading>
        {this.renderAssertionList()}
        {this.renderAssertionPickType()}
        <p><em className="small text-muted">Learn more about assertion types and our webhook format in our <a target="_blank" href="/docs/assertions">assertion docs</a>.</em></p>
      </Padding>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AssertionsSelection);