import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import fuzzy from 'fuzzy';
import cx from 'classnames';

import {Button} from '../forms';
import {Add, Checkmark, ChevronRight, Cloud, Delete, Mail, Search, Slack, PagerDuty} from '../icons';
import {Padding} from '../layout';
import {Heading} from '../type';
import {PagerdutyConnect, SlackConnect} from '../integrations';
import {flag, storage} from '../../modules';
import style from './notificationSelection.css';
import {
  integrations as actions
} from '../../actions';
import {Input} from '../forms';

const NotificationSelection = React.createClass({
  propTypes: {
    check: PropTypes.object,
    actions: PropTypes.shape({
      getSlackChannels: PropTypes.func,
      testNotification: PropTypes.func,
      getPagerdutyInfo: PropTypes.func
    }),
    notifications: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    scheme: PropTypes.string,
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
      notifications: this.props.notifications.map(n => {
        return this.getNewSchema(n.type, n.value);
      })
    };
  },
  componentDidMount(){
    this.props.actions.getSlackChannels();
    this.props.actions.getPagerdutyInfo();

    window.addEventListener('storage', event => {
      if (typeof event === 'object' && event.newValue === 'true') {
        if (event.key === 'shouldGetSlackChannels'){
          this.props.actions.getSlackChannels();
          storage.remove(event.key);
        } else if (event.key === 'shouldSyncPagerduty') {
          this.props.actions.getPagerdutyInfo();
          storage.remove(event.key);
        }
      }
    });
  },
  getNewSchema(type, value){
    // Pagerduty notifs don't have a value akin to a Slack channel, however it
    // still needs a unique value to track xhr state of test requests.
    // (This may change if/when we use PD service names as the value.)
    const schemaValue = type === 'pagerduty' ? `${type}-${Date.now()}` : value;
    return {
      type,
      value: schemaValue,
      sending: false,
      search: undefined
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
  getSlackChannels(index){
    let channels = this.props.redux.integrations.slackChannels.toJS();
    if (this.state.notifications[index].search){
      channels = _.chain(channels)
      .map(channel => {
        let score = 0;
        const hits = fuzzy.filter(this.state.notifications[index].search, [channel.name]);
        if (hits.length){
          score = hits.map(el => el.score).reduce((total, n) => total + n) || 0;
        }
        return _.assign(channel, {
          score
        });
      })
      .filter('score')
      .sortBy(c => -1 * c.score)
      .map(c => _.omit(c, 'score'))
      .value();
    }
    return channels;
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
    const notifications = _.cloneDeep(this.state.notifications).map((n, i) => {
      const value = data || n.valueState;
      return _.assign({}, n, {
        value: index === i ? value : n.value
      });
    }, true);
    this.runChange(notifications);
  },
  runNewNotif(type, value){
    const notifications = this.state.notifications.concat([
      this.getNewSchema(type, value)
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
    const notifs = _.cloneDeep(this.state.notifications).map((n, i) => {
      return _.assign({}, n, {
        value: index === i ? data.value : n.value
      });
    });
    this.runChange(notifs);
  },
  handleSlackSearch(state){
    this.setState(state);
  },
  handleShowAll(index, e){
    e.preventDefault();
    const notifications = this.state.notifications.map((n, i) => {
      if (i === index){
        return _.assign(n, {
          showAllChannels: true
        });
      }
      return n;
    });
    this.setState({
      notifications
    });
  },
  handleSubmit(e){
    e.preventDefault();
    return false;
  },
  renderNotifIcon(notif, initProps = {}){
    const props = _.assign(initProps, {
      fill: initProps.fill ? initProps.fill : 'text',
      inline: true
    });
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
  renderIntegrationConnect(notif, index, integration){
    let connectLink;
    if (integration === 'slack_bot'){
      connectLink = (
        <span><SlackConnect/> to choose your channel.</span>
      );
    } else if (integration === 'pagerduty'){
      connectLink = (
        <span><PagerdutyConnect target="_blank"/> to start alerting.</span>
      );
    }

    return (
      <div className="display-flex">
        <Padding r={2} className="flex-1">
          {connectLink}
        </Padding>
        <div className="align-self-start">
          {this.renderDeleteButton(index, {minHeight: '46px'})}
        </div>
      </div>
    );
  },
  renderChannels(index){
    const channels = this.getSlackChannels(index);
    const notif = this.state.notifications[index];
    let data = channels;
    const limit = 30;
    const tooMany = channels.length > limit;
    if (channels.length){
      if (tooMany && !notif.showAllChannels){
        data = _.take(channels, limit);
      }
      const buttons = data.map(c => {
        return (
          <Button flat onClick={this.runSetValue.bind(this, index, c.id)} style={{margin: '0 .5rem 1rem', textTransform: 'lowercase'}} key={`slack-channel-${c.id}-${index}`}>#{c.name}</Button>
        );
      });
      const remaining = channels.length - data.length;
      return (
        <div>
          {buttons}
          {tooMany && !notif.showAllChannels && (
            <div>
              {remaining} channel{remaining > 1 && 's'} not shown. Use the search above or <a href="#" onClick={this.handleShowAll.bind(null, index)}>Show All</a>
            </div>
          )}
        </div>
      );
    }
    return <div>No channels match your search.</div>;
  },
  renderChannelSelect(notif, index){
    return (
      <div>
        <Heading level={4}>Slack Channel</Heading>
        <div className="display-flex flex-wrap">
          <Padding className="flex-1" r={1}>
            <Input data={this.state} path={`notifications[${index}].search`} onChange={this.handleSlackSearch} placeholder="Search Slack channels">
              <Search/>
            </Input>
          </Padding>
          <div className="align-self-start">
            {this.renderDeleteButton(index, {minHeight: '46px'})}
          </div>
          <Padding t={1} style={{width: '100%'}}>
            {this.renderChannels(index)}
          </Padding>
        </div>
      </div>
    );
  },
  renderChosenChannel(notif, index){
    const display = this.getNotifValueForDisplay(notif);
    return (
      <div>
        <Heading level={4}>Slack Channel</Heading>
        <div className="display-flex flex-vertical-align">
          <div className="flex-1">
            <div className="display-flex">
              {display && <span>{this.renderNotifIcon(notif)}&nbsp;{display}</span>}
              {!display && <span><strong>Slack integration inactive.</strong>&nbsp;<SlackConnect/></span>}
            </div>
          </div>
          {this.renderDeleteButton(index)}
          {this.renderTestButton(notif)}
        </div>
      </div>
    );
  },
  renderPagerDutyNotif(notif, index) {
    return (
      <div className="display-flex flex-vertical-align">
        <div className="flex-1">
          <div className="display-flex">
            <PagerDuty className={cx(style.buttonIconPagerDuty, style[this.props.scheme])} />
          </div>
        </div>
        {this.renderDeleteButton(index)}
        {this.renderTestButton(notif)}
      </div>
    );
  },
  renderNotif(notif, index){
    const {type} = notif;

    switch (type) {
    case 'email':
    case 'webhook':
      return this.renderTextNotif(notif, index);
    case 'slack_bot':
      if (!notif.value) {
        if (this.props.redux.integrations.slackChannels.toJS().length){
          return this.renderChannelSelect(notif, index);
        }
        return this.renderIntegrationConnect(notif, index, type);
      }
      return this.renderChosenChannel(notif, index);
    case 'pagerduty':
      if (_.get(this.props.redux, 'integrations.pagerdutyInfo.enabled')) {
        return this.renderPagerDutyNotif(notif, index);
      }
      return this.renderIntegrationConnect(notif, index, type);
    default:
      return this.renderChosenChannel(notif, index);
    }
  },
  renderNotifPickType(){
    return (
      <div>
        {['email', 'slack', 'webhook', 'pagerduty'].map(type => {
          const typeCorrected = type === 'slack' ? 'slack_bot' : type;
          if (flag(`notification-type-${type}`)){
            let disabled = false;
            let title = null;
            let innerButton;
            if (type === 'pagerduty') {
              // Only allow one pagerduty notif in the list
              if (!!_.find(this.state.notifications, {type: 'pagerduty'})) {
                disabled = true;
                title = 'PagerDuty has already been added';
              }
              //innerButton = <span><PagerDuty className={cx(style.buttonIconPagerDuty, style[this.props.scheme], disabled && style.buttonIconPagerDutyDidisabled, style.primary)} /></span>;
              innerButton = <span><PagerDuty fill="primary"/></span>;
            } else {
              innerButton = <span>{_.capitalize(type)}&nbsp;{this.renderNotifIcon({type}, {inline: true, fill: 'primary'})}</span>;
            }
            return (
              <div title={title} style={{display: 'inline'}} key={`notif-pick-type-${type}`}>
                <Button flat color="primary" onClick={this.runNewNotif.bind(null, typeCorrected)} className="flex-1" style={{margin: '0 1rem 1rem 0'}} key={`notif-button-${type}`} disabled={disabled} title={title}>
                  <Add inline fill="primary"/>&nbsp;{innerButton}
                </Button>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  },
  renderNotifList(){
    if (!this.state.notifications.length) {
      return null;
    }
    return this.state.notifications.map((notif, index) => {
      return (
        <div key={`notif-${index}`}>
          {this.renderNotif(notif, index)}
          <hr/>
        </div>
      );
    });
  },
  render(){
    return (
      <Padding b={1}>
        {this.renderNotifList()}
        {this.renderNotifPickType()}
        <p><em className="small text-muted">Learn more about notification types and our webhook format in our <a target="_blank" href="/docs/notifications">notification docs</a>.</em></p>
      </Padding>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state,
  scheme: state.app.scheme
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSelection);