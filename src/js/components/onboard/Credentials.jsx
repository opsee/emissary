import React, {PropTypes} from 'react';
import Toolbar from '../global/Toolbar.jsx';
import OnboardStore from '../../stores/Onboard';
import OnboardActions from '../../actions/Onboard';
import UserStore from '../../stores/User';
import AWSStore from '../../stores/AWS';
import {State} from 'react-router';
import Link from 'react-router/lib/components/Link';
import forms from 'newforms';
import OpseeBoundField from '../forms/OpseeBoundField.jsx';
import _ from 'lodash';
import $q from 'q';
import router from '../../router.jsx';

let checkSubdomainPromise;
let domainPromisesArray = [];

const regions = AWSStore.getRegions();
const regionChoices = regions.map(r => {
  return [r.id, r.name]
});

const InfoForm = forms.Form.extend({
  credsKey: forms.CharField({
    widgetAttrs:{
      placeholder:'your 20-digit AWS access key ID',
      widget: forms.PasswordInput
    }
  }),
  credsSecret: forms.CharField({
    widgetAttrs:{
      placeholder:'your 40-digit secret key',
      widget: forms.PasswordInput
    }
  }),
});

const Team = React.createClass({
  mixins: [State, OnboardStore.mixin],
  storeDidChange(){
  },
  getInitialState() {
    var self = this;
    var data = OnboardStore.getData();
    const obj = {
      info:new InfoForm({
        onChange(){
          self.onChange(self.state.info.cleanedData);
          self.forceUpdate();
        },
        labelSuffix:'',
        data: {
          regions:['us-west-1', 'sa-east-1']
        },
        validation:{
          on:'blur change',
          onChangeDelay:100
        },
      })
    }
    setTimeout(function(){
      obj.info.validate();
    },10);
    return obj;
  },
  onChange(data){
    this.setState({name:data.name, subdomain:data.subdomain});
  },
  updateUserData(data){
    this.setState({password:data.password})
  },
  submit(e){
    e.preventDefault();
    console.log(this.state.info);
    // router.transitionTo('onboardRegionSelect');
  },
  disabled(){
    return !this.state.info.cleanedData.regions || !this.state.info.cleanedData.regions.length;
  },
  render() {
    return (
       <div>
        <Toolbar title="AWS Credentials"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <form onSubmit={this.submit}>
               <p>We need your AWS credentials to scan your environment for instances and services, and report back any errors. They&rsquo;re required to continue, but <strong>we will not store them.</strong></p>
               <div><br/></div>
               <OpseeBoundField bf={this.state.info.boundField('credsKey')}/>
               <OpseeBoundField bf={this.state.info.boundField('credsSecret')}/>
               <button type="submit" className="btn btn-raised btn-success btn-block ng-disabled" disabled={this.disabled()}>
                  <span>Next</span>
                </button>
              </form>
              {
              // <pre>{JSON.stringify(this.state.info.cleanedData, null, ' ')}</pre>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Team;