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
import {SlackInfo} from '../integrations';
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
    validators: [forms.validators.URLValidator],
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
  getInitialState() {
    return {
      notifications: []
    };
  },
  componentWillMount(){
    this.props.integrationsActions.getSlackChannels();
  },
  componentWillReceiveProps(nextProps) {
    // const {status} = nextProps.redux.asyncActions.integrationsSlackChannels;
    // const channels = nextProps.redux.integrations.slackChannels;
    // let arr = [];
    // arr.push(status === 'success' && !channels.size);
    // arr.push(status === 'pending');
    // arr.push(!status);
    // const bool = _.every(arr, a => a === false) || channels.size;
    // if (bool && !this.state.ready){
    //   this.setState(this.getState(nextProps));
    // }
  },
  getNewSchema(type, notifIndex){
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
      }
    };
    return {
      type,
      value: undefined,
      form: type === 'email' ? new EmailForm(opts) : new WebhookForm(opts)
    }
  },
  getFinalData(){
    return _.chain(this.getNotificationsForms())
    .map(form => {
      const n = form.cleanedData;
      let obj = _.pick(n, ['type', 'value']);
      if (obj.type === 'slack'){
        obj.value = n.channel;
      }
      return obj;
    }).value();
  },
  getNotifValueForDisplay(notif = {}){
    if (notif.type === 'slack'){
      const channels = this.props.redux.integrations.slackChannels.toJS();
      return '#' + _.chain(channels).find(c => c.id === notif.value).get('name').value();
    }
    return notif.value;
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
  },
  runChange(){
    this.forceUpdate();
    this.props.onChange(this.getFinalData());
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
  runNewNotif(type){
    this.setState({
      notifications: this.state.notifications.concat([this.getNewSchema(type, this.state.notifications.length)])
    })
  },
  runDelete(index){
    this.setState({
      notifications: _.reject(this.state.notifications, (n, i) => i === index)
    });
  },
  handleInputChange(data, index){
    this.runSetNotificationsState((n, i) => {
      return _.assign({}, n, {
        value: index === i ? data.text : n.value
      });
    });
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
          <div className="display-flex">
            <Button flat color="danger" title="Remove this Notification" onClick={this.runDelete.bind(null, index)} className="align-self-end" style={{minHeight: '46px'}}>
              <Delete inline fill="danger"/>
            </Button>
            <div className="flex-1">
              <div className="display-flex">
                {
                  // onSubmit={this.runSetValue.bind(this, index, notif.valueState)
                }
                <form name={`notif-email-form-${index}`} className="display-flex flex-1">
                  <Padding l={2} r={2} className="flex-1">
                    {notif.form.render()}
                    {
                    // <input value={notif.valueState} onChange={this.runSetValueState.bind(this, index)} type={inputType} placeholder={placeholder}/>
                    }
                  </Padding>
                  {
                  // <Button flat color="success" title="Ok" type="submit">Ok</Button>
                  }
                </form>
                <Button color="warning" flat className="align-self-end" style={{minHeight: '46px'}} disabled={!this.isNotifComplete(notif)}>
                  Test&nbsp;<ChevronRight inline fill={this.isNotifComplete(notif) ? 'warning' : 'text'}/>
                </Button>
              </div>
            </div>
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
                <Button flat color="danger" title="Back" onClick={this.runDelete.bind(this, index)} className="align-self-start">
                  <Delete inline fill="danger"/>
                </Button>
                <Padding l={2} className="flex-1">
                {channels.map(c => {
                  return (
                    <Button flat onClick={this.runSetValue.bind(this, index, c.id)} color="text" style={{margin: '0 .5rem 1rem', textTransform: 'lowercase'}}>#{c.name}</Button>
                  );
                })}
                </Padding>
              </div>
              </div>
            );
          } else {
            <SlackInfo/>
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
        <Button flat color="primary" onClick={this.runNewNotif.bind(null, 'email')} className="flex-1" style={{margin: '0 1rem 0 0'}} disabled={this.isNewDisabled()}>
          <Add inline fill={this.isNewDisabled() ? 'text' : 'primary'}/>&nbsp;Email
        </Button>
        <Button flat color="primary" onClick={this.runNewNotif.bind(null, 'slack')} className="flex-1" style={{margin: '0 1rem 0 0'}} disabled={this.isNewDisabled()}>
          <Add inline fill={this.isNewDisabled() ? 'text' : 'primary'}/>&nbsp;Slack
        </Button>
        <Button flat color="primary" onClick={this.runNewNotif.bind(null, 'webhook')} className="flex-1" style={{margin: '0 1rem 0 0'}} disabled={this.isNewDisabled()}>
          <Add inline fill={this.isNewDisabled() ? 'text' : 'primary'}/>&nbsp;Webhook
        </Button>
      </div>
    );
  },
  render(){
    return (
      <Padding b={2}>
        <Heading level={3}>Notifications</Heading>
        {this.state.notifications.map((notif, index) => {
          return (
            <div key={`notif-${index}`}>
              {this.renderNotif(notif, index)}
              <hr/>
            </div>
          );
        })
        }
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