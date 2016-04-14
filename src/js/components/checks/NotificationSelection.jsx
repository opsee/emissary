import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Button} from '../forms';
import {Add, Checkmark, ChevronRight, Cloud, Delete, Mail, Slack} from '../icons';
import {Padding} from '../layout';
import {Heading} from '../type';
import {SlackConnect} from '../integrations';
import {flag, storage} from '../../modules';
import style from './notificationSelection.css';
import {
  integrations as actions
} from '../../actions';
import {Input} from '../forms2';

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
      }).isRequired,
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
      notifications: this.props.notifications.map((n, i) => {
        return this.getNewSchema(n.type, i, n.value);
      })
    };
  },
  componentDidMount(){
    this.props.actions.getSlackChannels();
    window.addEventListener('storage', event => {
      if (typeof event === 'object' && event.key === 'shouldGetSlackChannels' && event.newValue === 'true'){
        this.props.actions.getSlackChannels();
        storage.remove('shouldGetSlackChannels');
      }
    });
  },
  getNewSchema(type, notifIndex, value){
    return {
      type,
      value,
      sending: false
    };
  },
  getNotifValueForDisplay(notif = {}){
    if (notif.type === 'slack_bot'){
      const channels = this.props.redux.integrations.slackChannels.toJS();
      return _.chain(channels).find(c => c.id === notif.value).get('name').value();
    }
    return notif.value;
  },
  getFinalNotifications(notifs = this.state.notifications){
    return notifs.map(n => _.pick(n, ['type', 'value']));
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
    const notifications = this.state.notifications.map(n => {
      return _.assign({}, n, {
        sending: n.type === notif.type && n.value === notif.value
      });
    });
    this.runChange(notifications);
  },
  handleInputChange(index, data){
    const notifs = this.runSetNotificationsState((n, i) => {
      return _.assign({}, n, {
        value: index === i ? data.value : n.value
      });
    });
    this.props.onChange(this.getFinalNotifications(notifs));
  },
  handleSubmit(e){
    e.preventDefault();
    return false;
  },
  renderNotifIcon(notif, props = {}){
    const {type} = notif;
    let el = <Mail {...props}/>;
    if (type === 'slack_bot' || type === 'slack'){
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
    const disabled = !this.isNotifComplete(notif) || !!(string.match('sent|error')) || notif.sending;
    const className = notif.type === 'slack_bot' ? style.testButtonSlack : style.testButton;
    let icon = <ChevronRight inline fill={disabled ? 'text' : 'warning'}/>;
    if (string === 'sent'){
      icon = <Checkmark inline fill="text"/>;
    }
    return (
      <div className="align-self-end">
        <Button color={color} flat onClick={this.runTestNotif.bind(this, notif)} className={className} {...props} disabled={disabled} style={{minHeight: '46px'}}>
          {string}&nbsp;{icon}
        </Button>
      </div>
    );
  },
  renderForm(notif, index){
    if (notif.type === 'email'){
      return (
        <Input placeholder="address@domain.com" onChange={this.handleInputChange.bind(null, index)} data={notif} path="value" label="Email*">
          <Mail/>
        </Input>
      );
    }
    return (
      <Input placeholder="https://alert.me/incoming" onChange={this.handleInputChange.bind(null, index)} data={notif} path="value" label="Webhook URL*">
        <Cloud/>
      </Input>
    );
  },
  renderTextNotif(notif, index){
    return (
      <div className={style.line}>
        <Padding b={1} className={`display-flex ${style.inputArea}`}>
          <div className="flex-1">
            {this.renderForm(notif, index)}
          </div>
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
                <Button flat onClick={this.runSetValue.bind(this, index, c.id)} color="text" style={{margin: '0 .5rem 1rem', textTransform: 'lowercase'}} key={`slack-channel-${c.id}`}>#{c.name}</Button>
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
      if (type === 'slack_bot'){
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
          const typeCorrected = type === 'slack' ? 'slack_bot' : type;
          if (flag(`notification-type-${type}`)){
            return (
              <Button flat color="primary" onClick={this.runNewNotif.bind(null, typeCorrected)} className="flex-1" style={{margin: '0 1rem 1rem 0'}} key={`notif-button-${type}`}>
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
        <p>Choose from the options below to set up notifications for this check.</p>
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
        <p><em className="small text-muted">Learn more about notification types and our webhook format in our <a target="_blank" href="/docs/notifications">notification docs</a>.</em></p>
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