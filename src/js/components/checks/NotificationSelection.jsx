import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Row, Col} from '../../modules/bootstrap';
import {BoundField, Button} from '../forms';
import {Add} from '../icons';
import {StatusHandler} from '../global';
import {Padding} from '../layout';
import {Heading} from '../type';
import {
  integrations as integrationsActions
} from '../../actions';

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
      ready: false
    };
  },
  componentWillMount(){
    this.props.integrationsActions.getSlackChannels();
  },
  componentWillReceiveProps(nextProps) {
    const {status} = nextProps.redux.asyncActions.integrationsSlackChannels;
    const channels = nextProps.redux.integrations.slackChannels;
    let arr = [];
    arr.push(status === 'success' && !channels.size);
    arr.push(status === 'pending');
    arr.push(!status);
    const bool = _.every(arr, a => a === false) || channels.size;
    if (bool && !this.state.ready){
      this.setState(this.getState(nextProps));
    }
  },
  getState(props) {
    const self = this;

    let initialNotifs = props.notifications || [];
    if (!initialNotifs.length){
      initialNotifs.push({
        type: 'email',
        value: props.redux.user.get('email')
      });
    }

    let channels = props.redux.integrations.slackChannels.toJS();
    let notificationOptions = ['email'];

    if (channels.length){
      channels = channels.map(c => [c.id, c.name]);
      notificationOptions.push('slack');
    }

    notificationOptions = notificationOptions.map(s => [s, _.capitalize(s)]);

    const NotificationForm = forms.Form.extend({
      type: forms.ChoiceField({
        choices: notificationOptions,
        widgetAttrs: {
          widgetType: 'Dropdown'
        }
      }),
      value: forms.CharField({
        label: 'Recipient',
        validators: [forms.validators.validateEmail],
        widgetAttrs: {
          placeholder: 'test@testing.com'
        },
        required: false
      }),
      channel: forms.ChoiceField({
        choices: channels,
        widgetAttrs: {
          widgetType: 'Dropdown'
        },
        required: false
      }),
      cleanValue(){
        if (this.cleanedData.type === 'email' && !this.cleanedData.value){
          throw forms.ValidationError('Recipient email required');
        }
      },
      cleanChannel(){
        if (this.cleanedData.type === 'slack' && !this.cleanedData.channel){
          throw forms.ValidationError('Channel selection required');
        }
      }
    });

    const NotificationFormSet = forms.FormSet.extend({
      form: NotificationForm,
      canDelete: true
    });

    const obj = {
      ready: true,
      notifications: new NotificationFormSet({
        onChange: self.runChange,
        labelSuffix: '',
        initial: initialNotifs,
        minNum: !initialNotifs.length ? 1 : 0,
        data: initialNotifs,
        extra: 0
      })
    };

    //this is a workaround because the library is not working correctly with initial + data formset
    setTimeout(() => {
      self.state.notifications.forms().forEach((form, i) => {
        let notif = initialNotifs[i];
        if (notif){
          form.setData(notif);
        }
      });
      this.setState({hasSetNotifications: true});
    }, 30);

    //do this because we want parent component to know about initial data
    setTimeout(this.runChange, 60);

    return obj;
  },
  getNotificationsForms(){
    return _.reject(this.state.notifications.forms(), f => {
      return f.cleanedData.DELETE;
    });
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
  isDisabled(){
    let notifsComplete = _.chain(this.getNotificationsForms()).map(n => n.isComplete()).every().value();
    return !(this.state.info.isComplete() && notifsComplete) || this.props.redux.asyncActions.checkCreate.status === 'pending';
  },
  runChange(){
    this.forceUpdate();
    this.props.onChange(this.getFinalData());
  },
  renderRemoveNotificationButton(form, index){
    if (index > 0){
      return (
        <Padding t={2}>
          <BoundField bf={form.boundField('DELETE')}/>
        </Padding>
      );
    }
    return (
      <Padding lr={1}>
       <div style={{width: '48px'}}/>
     </Padding>
    );
  },
  renderValueOrChannels(form){
    if (form.cleanedData.type === 'email'){
      return <BoundField bf={form.boundField('value')}/>;
    }
    return <BoundField bf={form.boundField('channel')}/>;
  },
  render(){
    if (!this.state.ready){
      return <StatusHandler status="pending"/>;
    }
    return (
      <Padding b={2}>
        <Heading level={3}>Notifications</Heading>
        {this.getNotificationsForms().map((form, index) => {
          return (
            <Padding b={2} key={`notif-form-${index}`}>
              <Row>
                <Col xs={10} sm={11}>
                  <Row>
                    <Col xs={12} sm={6}>
                      <BoundField bf={form.boundField('type')}/>
                    </Col>
                    <Col xs={12} sm={6}>
                      {this.renderValueOrChannels(form)}
                    </Col>
                  </Row>
                </Col>
                <Col xs={2} sm={1}>
                  <Padding t={1}>
                    {this.renderRemoveNotificationButton(form, index)}
                  </Padding>
                </Col>
              </Row>
            </Padding>
          );
        })
        }
        <Button color="primary" flat onClick={this.state.notifications.addAnother.bind(this.state.notifications)}><Add fill="primary" inline/> Add Another Notification</Button>
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