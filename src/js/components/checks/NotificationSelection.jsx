import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {BoundField, Button} from '../forms';
import {Add, ChevronRight, Cloud, Delete, Mail, Slack} from '../icons';
import {Padding} from '../layout';
import {Heading} from '../type';
import {SlackConnect} from '../integrations';
import {flag, storage} from '../../modules';
import style from './notificationSelection.css';
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

const NotificationSelection = React.createClass({
  propTypes: {
    check: PropTypes.object,
    actions: PropTypes.shape({
      getSlackChannels: PropTypes.func,
      testNotification: PropTypes.func
    }),
    notifications: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    redux: PropTypes.shape({
      user: PropTypes.object,
      integrations: PropTypes.shape({
        slackChannels: PropTypes.object,
        tests: PropTypes.array
      }),
      asyncActions: PropTypes.shape({
        checkCreate: PropTypes.object
      })
    })
  },
  getDefaultProps() {
    return {
      notifications: []
    };
  },
  getInitialState() {
    return {
      notifications: []
    };
  },
  componentDidMount(){
    this.props.actions.getSlackChannels();
    if (this.props.notifications.length){
      const notifications = this.props.notifications.map((n, i) => {
        return this.getNewSchema(n.type, i, n.value);
      });
      this.runChange(notifications);
    }
    window.addEventListener('storage', event => {
      if (typeof event === 'object' && event.key === 'shouldGetSlackChannels' && event.newValue === 'true'){
        this.props.actions.getSlackChannels();
        storage.remove('shouldGetSlackChannels');
      }
    });
  },
  getNewSchema(type, notifIndex, value){
    const self = this;
    const opts = {
      onChange(){
        self.handleInputChange(this.cleanedData, notifIndex);
        self.forceUpdate();
      },
      labelSuffix: '',
      prefix: `notif-${notifIndex}`,
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
      form: type === 'email' ? new EmailForm(opts) : new WebhookForm(opts)
    };
  },
  getNotifValueForDisplay(notif = {}){
    if (notif.type === 'slack'){
      const channels = this.props.redux.integrations.slackChannels.toJS();
      return _.chain(channels).find(c => c.id === notif.value).get('name').value();
    }
    return notif.value;
  },
  getFinalNotifications(notifs = this.state.notifications){
    return notifs.map(n => _.pick(n, ['type', 'value']));
  },
  isDisabled(){
    let notifsComplete = _.chain(this.getNotificationsForms()).map(n => n.isComplete()).every().value();
    return !(this.state.info.isComplete() && notifsComplete) || this.props.redux.asyncActions.checkCreate.status === 'pending';
  },
  isNotifComplete(notif){
    return _.chain(notif).pick(['type', 'value']).values().every().value();
  },
  runSetNotificationsState(iteratee){
    const notifications = this.state.notifications.map(iteratee);
    this.setState({
      notifications
    });
    return notifications;
  },
  runChange(notifications = this.state.notifications){
    this.setState({
      notifications
    });
    this.props.onChange(this.getFinalNotifications(notifications));
  },
  runSetType(index, type){
    this.runSetNotificationsState((n, i) => {
      return _.assign({}, n, {
        type: index === i ? type : n.type
      });
    });
  },
  runSetValue(index, data, e){
    if (e){
      e.preventDefault();
    }
    const notifications = this.runSetNotificationsState((n, i) => {
      const value = data || n.valueState;
      return _.assign({}, n, {
        value: index === i ? value : n.value
      });
    }, true);
    this.props.onChange(this.getFinalNotifications(notifications));
  },
  runRemoveType(index){
    this.runSetNotificationsState((n, i) => {
      return _.assign({}, n, {
        type: index === i ? undefined : n.type
      });
    });
  },
  runNewNotif(type, value){
    const notifications = this.state.notifications.concat([
      this.getNewSchema(type, this.state.notifications.length, value)
    ]);
    this.runChange(notifications);
  },
  runDelete(index){
    const notifications = _.reject(this.state.notifications, (n, i) => i === index);
    this.runChange(notifications);
  },
  runTestNotif(notif){
    this.props.actions.testNotification(_.pick(notif, ['type', 'value']));
  },
  handleInputChange(data, index){
    const notifs = this.runSetNotificationsState((n, i) => {
      return _.assign({}, n, {
        value: index === i ? data.text : n.value
      });
    });
    this.props.onChange(this.getFinalNotifications(notifs));
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
  renderNotifIcon(notif, props = {}){
    const {type} = notif;
    let el = <Mail {...props}/>;
    if (type === 'slack'){
      el = <Slack {...props}/>;
    } else if (type === 'webhook'){
      el = <Cloud {...props}/>;
    }
    return (
      <span title={notif.type}>{el}</span>
    );
  },
  renderDeleteButton(index){
    return (
      <Button flat color="danger" title="Remove this Notification" onClick={this.runDelete.bind(null, index)} style={{minHeight: '46px'}}>
        <Delete inline fill="danger"/>
      </Button>
    );
  },
  renderTestButton(notif, props){
    let string = 'test';
    const found = _.find(this.props.redux.integrations.tests, _.pick(notif, ['type', 'value']));
    if (found){
      string = found.success ? 'sent' : 'error';
    }
    let color = 'warning';
    if (string === 'sent'){
      color = 'success';
    } else if (string === 'error'){
      color = 'danger';
    }
    return (
      <div className={`align-self-end`}>
        <Button color={color} flat onClick={this.runTestNotif.bind(this, notif)} className={style.testButton} {...props} disabled={!this.isNotifComplete(notif) || !!(string.match('sent|error'))} style={{minHeight: '46px'}}>
          {string}&nbsp;<ChevronRight inline fill={this.isNotifComplete(notif) ? 'warning' : 'text'}/>
        </Button>
      </div>
    );
  },
  renderTextNotif(notif, index){
    return (
      <div className={style.line}>
        <Padding b={1} className={`display-flex ${style.inputArea}`}>
          <form name={`notif-email-form-${index}`} onSubmit={this.handleSubmit} className="flex-1">
            {notif.form.render()}
          </form>
          <Padding l={1} className="align-self-end">
            {this.renderDeleteButton(index)}
          </Padding>
        </Padding>
        {this.renderTestButton(notif)}
      </div>
    );
  },
  renderSlackConnect(notif, index){
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
  renderChannelSelect(notif, index){
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
  renderChosenChannel(notif, index){
    return (
      <div>
        <Heading level={4}>Slack Channel</Heading>
        <div className="display-flex flex-vertical-align">
          <div className="flex-1">
            <div className="display-flex">
              {this.renderNotifIcon(notif)}&nbsp;{this.getNotifValueForDisplay(notif)}
            </div>
          </div>
          {this.renderDeleteButton(index)}
          {this.renderTestButton(notif)}
        </div>
      </div>
    );
  },
  renderNotif(notif, index){
    const {type} = notif;
    const isText = !!type.match('email|webhook');
    if (!notif.value || isText){
      if (isText){
        return this.renderTextNotif(notif, index);
      }
      if (type === 'slack'){
        if (this.props.redux.integrations.slackChannels.toJS().length){
          return this.renderChannelSelect(notif, index);
        }
        return this.renderSlackConnect(notif, index);
      }
    }
    return this.renderChosenChannel(notif, index);
  },
  renderNotifPickType(){
    return (
      <div>
        {['email', 'slack', 'webhook'].map(type => {
          if (flag(`notification-type-${type}`)){
            return (
              <Button flat color="primary" onClick={this.runNewNotif.bind(null, type)} className="flex-1" style={{margin: '0 1rem 1rem 0'}} key={`notif-button-${type}`}>
                <Add inline fill="primary"/>&nbsp;{_.capitalize(type)}&nbsp;{this.renderNotifIcon({type}, {inline: true, fill: 'primary'})}
              </Button>
            );
          }
          return null;
        })}
      </div>
    );
  },
  renderNotifList(){
    if (this.state.notifications.length){
      return this.state.notifications.map((notif, index) => {
        return (
          <div key={`notif-${index}`}>
            {this.renderNotif(notif, index)}
            <hr/>
          </div>
        );
      });
    }
    return (
      <div>
        <p>Choose from the options below to set up a new notification for this check. You must have at least 1 notification.</p>
        <hr/>
      </div>
    );
  },
  render(){
    return (
      <Padding b={2}>
        <Heading level={3}>Notifications</Heading>
        {this.renderNotifList()}
        {this.renderNotifPickType()}
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSelection);