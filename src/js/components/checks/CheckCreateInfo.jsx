import React from 'react';
import _ from 'lodash';
import forms from 'newforms';

import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import {BoundField, Button} from '../forms';
import {Close, Add} from '../icons';
import colors from 'seedling/colors';
import {StepCounter} from '../global';
import {UserStore} from '../../stores';
import {Padding} from '../layout';

const intervalOptions = [
  ['5m','5min'],
  ['15m','15min'],
  ['24h','24hr'],
  ['7d','7d'],
]

const notificationOptions = ['email'].map(s => [s, _.capitalize(s)]);

const NotificationForm = forms.Form.extend({
  type: forms.ChoiceField({
    choices:notificationOptions
  }),
  value: forms.CharField({
    label: 'Recipient',
    widgetAttrs:{
      placeholder:'test@testing.com'
    },
  }),
});

const NotificationFormSet = forms.FormSet.extend({
  form:NotificationForm,
  canDelete:true
});


const InfoForm = forms.Form.extend({
  name: forms.CharField({
    label: 'Check name',
    widgetAttrs:{
      placeholder:'My Service 404 Check'
    }
  }),
  validation:'auto',
  render() {
    return (
      <Padding b={1}>
        <BoundField bf={this.boundField('name')}/>
      </Padding>
    );
  }
})

const data = {
  port:80
}

const CheckCreateInfo = React.createClass({
  getInitialState() {
    const self = this;

    let initialNotifs = self.props.check.notifications;
    if(!initialNotifs.length){
      initialNotifs.push({
        type:'email',
        value:UserStore.getUser().get('email')
      })
    }

    const obj = {
      info: new InfoForm(_.extend({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
      }, self.dataComplete() ? {data:this.props.check.check_spec.value} : null)),
      notifications: new NotificationFormSet({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
        initial:initialNotifs,
        minNum:!initialNotifs.length ? 1 : 0,
        extra:0
      }),
      submitting:false
    }

    //this is a workaround because the library is not working correctly with initial + data formset
    setTimeout(function(){
      self.state.notifications.forms().forEach((form,i) => {
        let notif = initialNotifs[i];
        if(notif){
          form.setData(notif);
        }
      });
    },10);
    return obj;
  },
  dataComplete(){
    return this.props.check.check_spec.value.name;
  },
  changeAndUpdate(){
    this.props.onChange(this.getFinalData(), this.disabled(), 3)
  },
  componentDidMount(){
    if(this.props.renderAsInclude){
      this.changeAndUpdate();
    }
  },
  renderRemoveNotificationButton(form, index){
    if(index > 0){
      return (
        <Padding t={2}>
          <BoundField bf={form.boundField('DELETE')}/>
        </Padding>
      )
    }else{
      return (
        <Padding lr={1}>
         <div style={{width:'48px'}}/>
       </Padding>
      )
    }
  },
  removeNotification(index){
    if(index > 0){
      this.state.notifications.removeForm(index);
    }
  },
  getNotificationsForms(){
    return _.reject(this.state.notifications.forms(), f => {
      return f.cleanedData.DELETE;
    });
  },
  renderNotificationForm(){
    return(
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
          )
        })
        }
        <Padding t={2}>
          <Button color="primary" noPad={true} flat={true} onClick={this.state.notifications.addAnother.bind(this.state.notifications)}><Add fill={colors.primary} inline={true}/> Add Another Notification</Button>
        </Padding>
      </div>
    )
  },
  getFinalData(){
    let check = _.clone(this.props.check);
    check.check_spec.value.name = this.state.info.cleanedData.name;
    check.notifications = _.reject(this.state.notifications.cleanedData(), 'DELETE').map(n => {
      return _.omit(n, 'DELETE');
    });
    return check;
  },
  getCleanedData(){
    let notificationData = this.state.notifications.cleanedData();
    const data = {
      notifications:notificationData
    }
    return _.assign(data, this.state.info.cleanedData);
  },
  disabled(){
    let notifsComplete = _.chain(this.getNotificationsForms()).map(n => n.isComplete()).every().value();
    return !(this.state.info.isComplete() && notifsComplete) || this.state.submitting;
  },
  renderSubmitButton(){
    if(!this.props.renderAsInclude){
      return(
        <div>
          <Padding t={2}> 
            <Button color="success" block={true} type="submit" onClick={this.submit} disabled={this.disabled()} chevron={true}>Finish</Button>
          </Padding>
          <StepCounter active={4} steps={4}/>
        </div>
      )
    }else{
      return <div/>
    }
  },
  innerRender() {
    const nonFieldErrors = this.state.info.nonFieldErrors();
    return (
      <form ref="form" onSubmit={this.onSubmit}>
        {this.state.info.render()}
        {this.renderNotificationForm()}
        {this.renderSubmitButton()}
      </form>
    )
  },
  renderAsPage(){
    return (
      <div>
        <Toolbar btnPosition="midRight" title={`Create Check (4 of 4)`} bg="info">
          <Button to="checks" icon={true} flat={true}>
            <Close btn={true}/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
            {this.innerRender()}
            </Col>
          </Row>
        </Grid>
      </div>
    )
  },
  render() {
    return this.props.renderAsInclude ? this.innerRender() : this.renderAsPage();
  },
  onSubmit(e) {
    e.preventDefault()
    this.setState({
      submitting:true
    });
    this.props.onSubmit();
  }
})

export default CheckCreateInfo;