import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';

import {Grid, Row, Col} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import {BoundField, Button} from '../forms';
import {Close, Add} from '../icons';
import colors from 'seedling/colors';
import {StepCounter} from '../global';
import {CheckStore, UserStore} from '../../stores';
import {Padding} from '../layout';

const notificationOptions = ['email'].map(s => [s, _.capitalize(s)]);

const NotificationForm = forms.Form.extend({
  type: forms.ChoiceField({
    choices: notificationOptions,
    widgetAttrs: {
      widgetType: 'Dropdown'
    }
  }),
  value: forms.CharField({
    label: 'Recipient',
    widgetAttrs: {
      placeholder: 'test@testing.com'
    }
  })
});

const NotificationFormSet = forms.FormSet.extend({
  form: NotificationForm,
  canDelete: true
});

const InfoForm = forms.Form.extend({
  name: forms.CharField({
    label: 'Check name',
    widgetAttrs: {
      placeholder: 'My Service 404 Check'
    }
  }),
  validation: 'auto',
  render() {
    return (
      <Padding b={1}>
        <BoundField bf={this.boundField('name')}/>
      </Padding>
    );
  }
});

const CheckCreateInfo = React.createClass({
  mixins: [CheckStore.mixin],
  propTypes: {
    check: PropTypes.object,
    onChange: PropTypes.func,
    renderAsInclude: PropTypes.bool,
    onSubmit: PropTypes.func
  },
  getInitialState() {
    const self = this;

    let initialNotifs = self.props.check.notifications;
    if (!initialNotifs.length){
      initialNotifs.push({
        type: 'email',
        value: UserStore.getUser().get('email')
      });
    }

    const obj = {
      info: new InfoForm(_.extend({
        onChange: self.runChange,
        labelSuffix: ''
      }, self.isDataComplete() ? {data: this.props.check.check_spec.value} : null)),
      notifications: new NotificationFormSet({
        onChange: self.runChange,
        labelSuffix: '',
        initial: initialNotifs,
        minNum: !initialNotifs.length ? 1 : 0,
        extra: 0
      }),
      submitting: false,
      hasSetNotifications: !self.isDataComplete()
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
    }, 50);
    return obj;
  },
  componentDidMount(){
    if (this.props.renderAsInclude){
      this.runChange();
    }
  },
  storeDidChange() {
    const status = CheckStore.getCheckCreateStatus();
    if (status !== 'pending'){
      this.setState({
        submitting: false
      });
    }
  },
  getNotificationsForms(){
    return _.reject(this.state.notifications.forms(), f => {
      return f.cleanedData.DELETE;
    });
  },
  getFinalData(){
    let check = _.cloneDeep(this.props.check);
    check.check_spec.value.name = this.state.info.cleanedData.name;
    if (this.state.hasSetNotifications){
      check.notifications = _.reject(this.state.notifications.cleanedData(), 'DELETE').map(n => {
        return _.omit(n, 'DELETE');
      });
    }
    return check;
  },
  getCleanedData(){
    let notificationData = this.state.notifications.cleanedData();
    const data = {
      notifications: notificationData
    };
    return _.assign(data, this.state.info.cleanedData);
  },
  isDataComplete(){
    return this.props.check.check_spec.value.name;
  },
  isDisabled(){
    let notifsComplete = _.chain(this.getNotificationsForms()).map(n => n.isComplete()).every().value();
    return !(this.state.info.isComplete() && notifsComplete) || this.state.submitting;
  },
  runChange(){
    this.props.onChange(this.getFinalData(), this.isDisabled(), 3);
  },
  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      submitting: true
    });
    this.props.onSubmit();
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
  renderNotificationForm(){
    return (
      <div>
        <h3>Notifications</h3>
        {this.getNotificationsForms().map((form, index) => {
          return (
            <Padding b={2}>
              <Row>
                <Col xs={10} sm={11}>
                  <Row>
                   <Col xs={12} sm={6}>
                      <BoundField bf={form.boundField('type')}/>
                      <Padding b={1} className="visible-xs"/>
                   </Col>
                    <Col xs={12} sm={6}>
                      <BoundField bf={form.boundField('value')}/>
                   </Col>
                  </Row>
                </Col>
                <Col xs={2} sm={1}>
                  {this.renderRemoveNotificationButton(form, index)}
                </Col>
              </Row>
            </Padding>
          );
        })
        }
        <Padding t={2}>
          <Button color="primary" noPad flat onClick={this.state.notifications.addAnother.bind(this.state.notifications)}><Add fill={colors.primary} inline/> Add Another Notification</Button>
        </Padding>
      </div>
    );
  },
  renderSubmitButton(){
    if (!this.props.renderAsInclude){
      return (
        <div>
          <Padding t={2}>
            <Button color="success" block type="submit" onClick={this.submit} disabled={this.isDisabled()} chevron>Finish</Button>
          </Padding>
          <StepCounter active={4} steps={4}/>
        </div>
      );
    }
    return <div/>;
  },
  renderInner() {
    return (
      <form ref="form" onSubmit={this.handleSubmit}>
        {this.state.info.render()}
        {this.renderNotificationForm()}
        {this.renderSubmitButton()}
      </form>
    );
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title={`Create Check (4 of 4)`} bg="info">
          <Button to="checks" icon flat>
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
            {this.renderInner()}
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

export default CheckCreateInfo;