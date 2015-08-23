import React from 'react';
import Actions from '../../actions/Check';
import Link from 'react-router/lib/components/Link';
import forms from 'newforms';
import _ from 'lodash';
import BottomButtonNav from '../global/BottomButtonNav.jsx';
import Toolbar from '../global/Toolbar.jsx';
import OpseeBoundField from '../forms/OpseeBoundField.jsx';
import {Close, ChevronRight} from '../icons/Module.jsx';
import colors from 'seedling/colors';

const intervalOptions = [
  ['5m','5min'],
  ['15m','15min'],
  ['24h','24hr'],
  ['7d','7d'],
]

const notificationOptions = [
  ['email','Email'],
  ['desktop','Desktop'],
  ['webhook','Webhook'],
  ['slack','Slack'],
]


const NotificationForm = forms.Form.extend({
  channel: forms.ChoiceField({
    choices:notificationOptions
  }),
  value: forms.CharField({
    widgetAttrs:{
      placeholder:'test@testing.com'
    },
  }),
});

const NotificationFormSet = forms.FormSet.extend({
  form:NotificationForm
});


const InfoForm = forms.Form.extend({
  name: forms.CharField({
    widgetAttrs:{
      placeholder:'My Service 404 Check'
    }
  }),
  // message: forms.CharField({
  //   widgetAttrs:{
  //     placeholder:'It all crashed.'
  //   }
  // }),
  validation:'auto',
  // interval: forms.ChoiceField({choices:intervalOptions}),
  clean() {
  },
  render() {
    return(
      <div>
        <h2>Check Name</h2>
        {this.boundFields().map(bf => {
          return <OpseeBoundField bf={bf}/>
        })}
      </div>
    )
  }
})

const data = {
  port:80
}

const AllFields = React.createClass({
  getInitialState() {
    const self = this;
    const obj = {
      info: new InfoForm({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
        data:this.props.check
      }),
      notifications: new NotificationFormSet({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
        initial:this.props.check.notifications,
        extra:0
      }),
    }
    //this is a workaround because the library is not working correctly with initial + data formset
    setTimeout(function(){
      self.state.notifications.forms().forEach((form,i) => {
        form.setData(self.props.check.notifications[i]);
      });
    },10);
    return obj;
  },
  changeAndUpdate(){
    this.props.onChange(this.getCleanedData())
    this.forceUpdate();
  },
  renderNotificationForm(){
    return(
      <div>
        <h2>Request Notifications</h2>
        {this.state.notifications.forms().map((form, index) => {
          return (
            <div>
              <div className="row">
                <div className="col-xs-12">
                  <h3>Notification {index+1}</h3>
                </div>
              </div>
              <div className="display-flex">
                <div className="row flex-1">
                  <div className="container-fluid">
                    <div className="row">
                      {form.boundFields().map(bf => {
                        return(
                          <div className="col-xs-12 col-sm-6">
                            <OpseeBoundField bf={bf}/>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="padding-lr">
                    <button type="button" className="btn btn-icon btn-flat" onClick={this.state.notifications.removeForm.bind(this.state.notifications,index)} title="Remove this Notification">
                      <Close btn={true}/>
                  </button>
                </div>
              </div>
            </div>
          )
        })
        }
        <button type="button" className="btn btn-info" onClick={this.state.notifications.addAnother.bind(this.state.notifications)}>Add Another Notification</button>
      </div>
    )
  },
  getCleanedData(){
    let notificationData = this.state.notifications.cleanedData();
    const data = {
      notifications:notificationData
    }
    return _.assign(data, this.state.info.cleanedData);
  },
  renderSubmitButton(){
    if(this.props.standalone){
      return(
        <button type="submit" className="btn btn-primary">Submit</button>
      )
    }
  },
  innerRender() {
    const nonFieldErrors = this.state.info.nonFieldErrors();
    // const notificationErrors = this.state.notifications.errors();
    return (
      <form ref="form" onSubmit={this.onSubmit}>
          {this.state.info.render()}
          {this.renderNotificationForm()}
          {this.renderSubmitButton()}
          {
            // <pre>{this.getCleanedData && JSON.stringify(this.getCleanedData(), null, ' ')}</pre>
          }
          {
            // <strong>Non field errors: {nonFieldErrors.render()}</strong>
          }
      </form>
    )
  },
  renderAsPage(){
    return (
      <div>
        <div className="bg-body" style={{position:"relative"}}>
          <Toolbar btnleft={true} title={`Create Check Step 3`}>
            {
              // this.renderLink()
            }
          </Toolbar>
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              {this.innerRender()}
              </div>
            </div>
          </div>
        </div>
        <BottomButtonNav>
          <button className="btn btn-flat btn-success" type="button" onClick={this.onSubmit}>
              <span>Finish 
                <ChevronRight inline={true} fill={colors.success}/>
              </span>
            </button>
          </BottomButtonNav>
      </div>
    )
  },
  render() {
    return this.props.renderAsInclude ? this.innerRender() : this.renderAsPage();
  },
  onSubmit(e) {
    e.preventDefault()
    this.state.info.validate(this.refs.info)
    this.state.notifications.validate(this.refs.notifications)
    this.forceUpdate();
    this.props.onSubmit();
  }
})

export default AllFields;