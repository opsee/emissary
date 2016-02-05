import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Row, Col} from '../../modules/bootstrap';
import {BoundField, Button} from '../forms';
import {Add, ChevronRight, Cloud, Delete, Mail, Slack} from '../icons';
import {StatusHandler} from '../global';
import {Padding} from '../layout';
import {Heading} from '../type';
import {SlackConnect} from '../integrations';
import style from './notificationSelection.css';
import {
  integrations as integrationsActions
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
    integrationsActions: PropTypes.shape({
      getSlackChannels: PropTypes.func
    }),
    onChange: PropTypes.func.isRequired,
    redux: PropTypes.shape({
      user: PropTypes.object,
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
    this.props.integrationsActions.getSlackChannels();
    if (this.props.notifications.length){
      this.props.notifications.forEach(n => {
        this.runNewNotif(n.type, n.value);
      });
    }
    window.addEventListener('storage', event => {
      if (event.key === 'shouldGetSlackChannels' && event.newValue === 'true'){
        this.props.integrationsActions.getSlackChannels();
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
    }
  },
  getNotifValueForDisplay(notif = {}){
    if (notif.type === 'slack'){
      const channels = this.props.redux.integrations.slackChannels.toJS();
      return '#' + _.chain(channels).find(c => c.id === notif.value).get('name').value();
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
  isNewDisabled(){
    return false;
    return !_.chain(this.state.notifications).last().thru(notif => this.isNotifComplete(notif)).value();
  },
  isNotifComplete(notif){
    return _.chain(notif).pick(['type', 'value']).values().every().value();
  },
  runSetNotificationsState(iteratee, addAnother){
    const notifications = this.state.notifications.map(iteratee);
    this.setState({
      notifications
    });
    return notifications;
  },
  runChange(){
    this.forceUpdate();
    const notifications = this.state.notifications.map(n => _.pick(n, ['type', 'value']));
    this.props.onChange(notifications);
  },
  runSetType(index, type){
    this.runSetNotificationsState((n, i) => {
      return _.assign({}, n, {
        type: index === i ? type : n.type
      });
    });
  },
  runSetValueState(index, e){
    const {value} = e.target;
    this.runSetNotificationsState((n, i) => {
      return _.assign({}, n, {
        valueState: index === i ? value : n.valueState
      });
    });
  },
  runSetValue(index, data, e){
    if (e){
      e.preventDefault();
    }
    this.runSetNotificationsState((n, i) => {
      const value = data || n.valueState;
      return _.assign({}, n, {
        value: index === i ? value : n.value
      });
    }, true);
  },
  runRemoveType(index, e){
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
    this.setState({
      notifications
    });
    this.props.onChange(this.getFinalNotifications(notifications));
  },
  runDelete(index){
    const notifications = _.reject(this.state.notifications, (n, i) => i === index);
    this.setState({
      notifications
    });
    this.props.onChange(this.getFinalNotifications(notifications));
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
  renderNotifIcon(notif){
    const {type} = notif;
    let el = <Mail/>;
    if (type === 'slack'){
      el = <Slack/>;
    } else if (type === 'webhook'){
      el = <Cloud/>;
    }
    return (
      <span title={notif.type}>{el}</span>
    );
  },
  renderNotif(notif, index){
    const {type} = notif;
    if (!notif.value || type === 'email' || type === 'webhook'){
      if (type === 'email' || type === 'webhook'){
        let placeholder;
        let inputType = 'text';
        switch (type){
          case 'email':
            placeholder = 'email';
            inputType = 'email';
            break;
          case 'webhook':
            placeholder = 'webhook';
            break;
          default:
            break;
        }
        return (
          <div className={style.line}>
            <Padding b={1} className={`display-flex ${style.inputArea}`}>
              <form name={`notif-email-form-${index}`} onSubmit={this.handleSubmit} className="flex-1">
                {notif.form.render()}
              </form>
              <Padding l={1} className="align-self-end">
                <Button flat color="danger" title="Remove this Notification" onClick={this.runDelete.bind(null, index)} style={{minHeight: '46px'}}>
                  <Delete inline fill="danger"/>
                </Button>
              </Padding>
            </Padding>
            <Button color="warning" flat className={`align-self-end ${style.testButton}`} style={{minHeight: '46px'}} disabled={!this.isNotifComplete(notif)}>
              Test&nbsp;<ChevronRight inline fill={this.isNotifComplete(notif) ? 'warning' : 'text'}/>
            </Button>
          </div>
        );
      }
      if (type === 'slack'){
        const channels = this.props.redux.integrations.slackChannels.toJS();
        if (channels.length){
          return (
            <div>
              <Heading level={4}>Slack Channel</Heading>
              <div className="display-flex">
                <Padding l={2} className="flex-1">
                  {channels.map(c => {
                    return (
                      <Button flat nocap onClick={this.runSetValue.bind(this, index, c.id)} color="text" style={{margin: '0 .5rem 1rem'}}>#{c.name}</Button>
                    );
                  })}
                  </Padding>
                  <Button flat color="danger" title="Back" onClick={this.runDelete.bind(this, index)} className="align-self-start">
                    <Delete inline fill="danger"/>
                  </Button>
                </div>
              </div>
            );
          } else {
            return (
              <div className="display-flex">
                <Padding r={2} className="flex-1">
                  <SlackConnect target="_blank"/> to choose your channel.
                </Padding>
                <Button flat color="danger" title="Back" onClick={this.runDelete.bind(this, index)} className="align-self-start">
                  <Delete inline fill="danger"/>
                </Button>
              </div>
            );
          }
      }
    }
    return (
      <div className="display-flex flex-vertical-align">
        <Button flat color="danger" title="Remove this Notification" onClick={this.runDelete.bind(null, index)}>
          <Delete inline fill="danger"/>
        </Button>
        <Padding l={2} className="flex-1">
          <div className="display-flex">
            {this.renderNotifIcon(notif)}&nbsp;{this.getNotifValueForDisplay(notif)}
          </div>
        </Padding>
        <Button color="warning" flat>Test <ChevronRight inline fill="warning"/></Button>
      </div>
    );
  },
  renderNotifPickType(){
    return (
      <div>
        {['email', 'slack', 'webhook'].map(type => {
          return (
            <Button flat color="primary" onClick={this.runNewNotif.bind(null, type)} className="flex-1" style={{margin: '0 1rem 1rem 0'}} disabled={this.isNewDisabled()}>
              <Add inline fill={this.isNewDisabled() ? 'text' : 'primary'}/>&nbsp;{_.capitalize(type)}
            </Button>
          );
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
      })
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
  integrationsActions: bindActionCreators(integrationsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSelection);