import React, {PropTypes} from 'react';
import Toolbar from '../global/Toolbar.jsx';
import OnboardStore from '../../stores/Onboard';
import OnboardActions from '../../actions/Onboard';
import UserStore from '../../stores/User';
import AWSStore from '../../stores/AWS';
import Link from 'react-router/lib/components/Link';
import forms from 'newforms';
import OpseeBoundField from '../forms/OpseeBoundField.jsx';
import _ from 'lodash';
import router from '../../router.jsx';

const InfoForm = forms.Form.extend({
  'access-key': forms.CharField({
    widget: forms.PasswordInput,
    label:'AWS Key',
    widgetAttrs:{
      placeholder:'your 20-digit AWS access key ID',
    }
  }),
  'secret-key': forms.CharField({
    widget: forms.PasswordInput,
    label:'AWS Secret',
    widgetAttrs:{
      placeholder:'your 40-digit secret key',
    }
  }),
});

const Team = React.createClass({
  mixins: [OnboardStore.mixin],
  storeDidChange(){
    const data = OnboardStore.getInstallData();
    const dataHasValues = _.chain(data).values().every(_.identity).value();
    if(dataHasValues && data.regions.length){
      router.transitionTo('onboardVpcSelect')
    }
  },
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
      info:new InfoForm({
        onChange(){
          self.forceUpdate();
        },
        data:data,
        labelSuffix:'',
        validation:{
          on:'blur change',
          onChangeDelay:100
        },
      })
    }
  },
  submit(e){
    e.preventDefault();
    OnboardActions.onboardSetCredentials(this.state.info.cleanedData);
  },
  disabled(){
    return !this.state.info.isValid();
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
               <OpseeBoundField bf={this.state.info.boundField('access-key')}/>
               <OpseeBoundField bf={this.state.info.boundField('secret-key')}/>
               <button type="submit" className="btn btn-raised btn-success btn-block ng-disabled" disabled={this.disabled()}>
                  <span>Next</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Team;