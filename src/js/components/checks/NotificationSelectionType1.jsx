import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Row, Col} from '../../modules/bootstrap';
import {BoundField, Button} from '../forms';
import {Add, ChevronLeft, Cloud, Delete, Mail, Slack} from '../icons';
import {StatusHandler} from '../global';
import {Padding} from '../layout';
import {Heading} from '../type';
import {SlackInfo} from '../integrations';
import {
  integrations as integrationsActions
} from '../../actions';

const schema = function(){
  return {
    type: undefined,
    value: undefined,
    valueState: undefined
  }
}

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
      notifications: [
        new schema()
      ]
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
  isNotifComplete(notif){
    return _.chain(notif).pick(['type', 'value']).values().every().value();
  },
  runSetNotificationsState(iteratee, addAnother){
    let notifications = this.state.notifications.map(iteratee);
    if (addAnother && _.chain(notifications).map(this.isNotifComplete).every().value()){
      notifications = notifications.concat([new schema()]);
    }
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
  runAddOne(){
    if (_.chain(this.state.notifications).last().thru(notif => this.isNotifComplete(notif)).value()){
      this.setState({
        notifications: this.state.notifications.concat([new schema()])
      })
    }
  },
  runDelete(index){
    this.setState({
      notifications: _.reject(this.state.notifications, (n, i) => i === index)
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
    if (!type){
      return (
        <div className="display-flex">
          <Button color="primary" onClick={this.runSetType.bind(null, index, 'email')} className="flex-1" style={{margin: '0 0 0 1rem'}}>
            <Add inline/>&nbsp;Email
          </Button>
          <Button color="primary" onClick={this.runSetType.bind(null, index, 'slack')} className="flex-1" style={{margin: '0 0 0 1rem'}}>
            <Add inline/>&nbsp;Slack
          </Button>
          <Button color="primary" onClick={this.runSetType.bind(null, index, 'webhook')} className="flex-1" style={{margin: '0 0 0 1rem'}}>
            <Add inline/>&nbsp;Webhook
          </Button>
        </div>
      );
    } else if (!notif.value){
      if (type === 'email' || type === 'webhook'){
        let placeholder;
        let inputType = 'text';
        switch (type){
          case 'email':
            placeholder = 'pepe@therarest.com';
            inputType = 'email';
            break;
          case 'webhook':
            placeholder = 'https://pepelove.com/incoming';
            break;
          default:
            break;
        }
        return (
          <form name={`notif-email-form-${index}`} onSubmit={this.runSetValue.bind(this, index, notif.valueState)} className="display-flex">
            <Button flat color="warning" title="Back" onClick={this.runRemoveType.bind(this, index)}>
              <ChevronLeft inline fill="warning"/>
            </Button>
            <Padding l={2} r={2} className="flex-1">
              <input value={notif.valueState} onChange={this.runSetValueState.bind(this, index)} type={inputType} placeholder={placeholder}/>
            </Padding>
            <Button flat color="success" title="Ok" type="submit">Ok</Button>
          </form>
        );
      }
      if (type === 'slack'){
        const channels = this.props.redux.integrations.slackChannels.toJS();
        if (channels.length){
          return (
            <div className="display-flex">
              <Button flat color="warning" title="Back" onClick={this.runRemoveType.bind(this, index)}>
                <ChevronLeft inline fill="warning"/>
              </Button>
              <Padding l={2} className="flex-1">
              {channels.map(c => {
                return (
                  <Button onClick={this.runSetValue.bind(this, index, c.id)} color="info" style={{margin: '.5rem'}}>#{c.name}</Button>
                );
              })}
              </Padding>
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
        <Padding l={2}>
          <div className="display-flex">
            {this.renderNotifIcon(notif)}&nbsp;{this.getNotifValueForDisplay(notif)}
          </div>
        </Padding>
      </div>
    );
  },
  render(){
    return (
      <Padding b={2}>
        <Heading level={3}>Notifications</Heading>
        {this.state.notifications.map((notif, index) => {
          return (
            <Padding b={2} key={`notif-${index}`}>
              {this.renderNotif(notif, index)}
            </Padding>
          );
        })
        }
        {
          //<Button color="primary" flat onClick={this.runAddOne}><Add fill="primary" inline/> Add Another Notification</Button>
        }
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