import React from 'react';
import {Link} from 'react-router';
import {Grid, Row, Col, Button} from '../../modules/bootstrap';
import forms from 'newforms';
import _ from 'lodash';
import BottomButtonNav from '../global/BottomButtonNav.jsx';
import {Toolbar} from '../global';
import OpseeBoundField from '../forms/OpseeBoundField.jsx';
import {Close, ChevronRight} from '../icons';
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
  validation:'auto',
  // interval: forms.ChoiceField({choices:intervalOptions}),
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
      info: new InfoForm(_.extend({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
      }, self.dataComplete() ? {data:this.props.check} : null)),
      notifications: new NotificationFormSet({
        onChange:self.changeAndUpdate,
        labelSuffix:'',
        initial:this.props.check.notifications,
        minNum:!this.props.check.notifications.length ? 1 : 0,
        extra:0
      }),
    }
    //this is a workaround because the library is not working correctly with initial + data formset
    setTimeout(function(){
      self.state.notifications.forms().forEach((form,i) => {
        let notif = self.props.check.notifications[i];
        console.log(notif);
        if(notif){
          form.setData(notif);
        }
      });
    },10);
    return obj;
  },
  dataComplete(){
    return _.chain(['name']).map(s => this.props.check[s]).every().value();
  },
  changeAndUpdate(){
    this.props.onChange(this.getCleanedData())
    // this.forceUpdate();
  },
  renderNotificationForm(){
    return(
      <div>
        <h2>Notifications</h2>
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
  disabled(){
    return !this.state.info.isComplete();
  },
  renderSubmitButton(){
    if(this.props.standalone){
      return(
        <Button bsStyle="success" block={true} type="submit" onClick={this.submit} disabled={this.disabled()}>
          Finish
        </Button>
      )
    }else{
      return(
        <div>
          <div><br/><br/></div>
          <div>
            <Button bsStyle="success" block={true} type="submit" onClick={this.submit} disabled={this.disabled()}>
                <span>Finish
                  <ChevronRight inline={true} fill={colors.success}/>
                </span>
            </Button>
          </div>
        </div>
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
          <Grid>
            <Row>
              <Col xs={12} sm={10} smOffset={1}>
              {this.innerRender()}
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    )
  },
  render() {
    return this.props.renderAsInclude ? this.innerRender() : this.renderAsPage();
  },
  onSubmit(e) {
    e.preventDefault()
    this.props.onSubmit();
  }
})

export default AllFields;