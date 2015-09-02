import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import {OnboardActions} from '../../actions';
import {OnboardStore} from '../../stores';
import {Link} from 'react-router';
import forms from 'newforms';
import {BoundField, Button} from '../forms';
import _ from 'lodash';
import router from '../../modules/router.js';
import {Grid, Row, Col} from '../../modules/bootstrap';

console.log(Grid,Row,Col,BoundField,Link,OnboardStore,OnboardActions,Toolbar)

const InfoForm = forms.Form.extend({
  'access-key': forms.CharField({
    widget: forms.PasswordInput,
    label:'AWS Key',
    widgetAttrs:{
      placeholder:'Your AWS Access Key',
    }
  }),
  'secret-key': forms.CharField({
    widget: forms.PasswordInput,
    label:'AWS Secret',
    widgetAttrs:{
      placeholder:'Your AWS Secret Key',
    }
  }),
});

const Credentials = React.createClass({
  mixins: [],
  statics:{
    willTransitionTo(transition, params, query){
      const data = OnboardStore.getInstallData();
      if(!data.regions.length){
        transition.redirect('onboardRegionSelect');
      }
    }
  },
  getInitialState() {
    var self = this;
    var data = OnboardStore.getInstallData();
    return {
      info:new InfoForm(_.extend({
        onChange(){
          OnboardActions.onboardSetCredentials(self.state.info.cleanedData);
          self.forceUpdate();
        },
        labelSuffix:'',
        validation:{
          on:'blur change',
          onChangeDelay:100
        },
      }, self.dataComplete() ? {data:data} :  null))
    }
  },
  dataComplete(){
    return _.chain(OnboardStore.getInstallData()).values().every(_.identity).value();
  },
  submit(e){
    e.preventDefault();
    router.transitionTo('onboardVpcSelect')
    OnboardActions.onboardSetCredentials(this.state.info.cleanedData);
  },
  disabled(){
    return !this.state.info.isValid();
  },
  render() {
    return (
       <div>
        <Toolbar title="AWS Credentials"/>
          <Grid>
            <Row>
              <Col xs={12} sm={10} smOffset={1}>
              <form onSubmit={this.submit}>
               <p>We need your AWS credentials to scan your environment for instances and services, and report back any errors. They&rsquo;re required to continue, but <strong>we will not store them.</strong></p>
               <div><br/></div>
               <BoundField bf={this.state.info.boundField('access-key')}/>
               <BoundField bf={this.state.info.boundField('secret-key')}/>
               <button type="submit" className="btn btn-raised btn-success btn-block" disabled={this.disabled()}>
                  <span>Next</span>
                </button>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Credentials;