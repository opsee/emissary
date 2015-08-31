import React, {PropTypes} from 'react';
import Toolbar from '../global/Toolbar.jsx';
import UserInputs from '../user/UserInputs.jsx';
import OnboardStore from '../../stores/Onboard';
import OnboardActions from '../../actions/Onboard';
import UserStore from '../../stores/User';
import {State} from 'react-router';
import router from '../../modules/router.js';
import Link from 'react-router/lib/components/Link';
import forms from 'newforms';
import OpseeBoundField from '../forms/OpseeBoundField.jsx';
import _ from 'lodash';
import $q from 'q';

let checkSubdomainPromise;
let domainPromisesArray = [];

const InfoForm = forms.Form.extend({
  name: forms.CharField({
    widgetAttrs:{
      placeholder:'Initech'
    }
  }),
  subdomain: forms.SlugField({
    widgetAttrs:{
      placeholder:'initech[.opsee.co]'
    },
    validation:{
      on:'blur change',
      onChangeDelay:200
    }
  }),
  cleanSubdomain(cb){
    const string = this.cleanedData.subdomain;
    const date = Date.now();
    OnboardActions.subdomainAvailability(string, date);
    domainPromisesArray.push({date:date,promise:$q.defer()});
    const correctPromise = domainPromisesArray[(domainPromisesArray.length-1)].promise;
    correctPromise.promise.then((avail) => {
      avail ? cb() : cb(null, 'is not available.');
    });
  }
});

const Team = React.createClass({
  mixins: [State, OnboardStore.mixin],
  storeDidChange(){
    const availData = OnboardStore.getSubdomainAvailable();
    const availStatus = OnboardStore.getSubdomainAvailabilityStatus();
    this.setState({availStatus});
    if(availStatus == 'success'){
      const promise = _.find(domainPromisesArray, {date:availData.date});
      promise.promise.resolve(availData.available);
      this.setState({domainAvailable:availData.available});
    }
    const createOrgStatus = OnboardStore.getCreateOrgStatus();
    if(createOrgStatus == 'success'){
      router.transitionTo('onboardRegionSelect');
    }
    this.setState({createOrgStatus});
  },
  getInitialState() {
    var self = this;
    return {
      info:new InfoForm({
        onChange(){
          self.forceUpdate();
        },
        labelSuffix:'',
        data:_.cloneDeep(self.props),
        validation:{
          on:'blur change',
          onChangeDelay:100
        },
      })
    }
  },
  submit(e){
    e.preventDefault();
    OnboardActions.onboardCreateOrg(this.state.info.cleanedData);
  },
  disabled(){
    return !this.state.info.isValid() || (this.state.availStatus == 'pending' && !this.state.domainAvailable);
  },
  btnText(){
    return this.state.createOrgStatus == 'pending' ? 'Setting...' : 'Set';
  },
  render() {
    return (
       <div>
        <Toolbar title="Create Your Team"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <form name="loginForm" ng-submit="submit()" onSubmit={this.submit}>
                <OpseeBoundField bf={this.state.info.boundField('name')}/>
                <div className="text-sm text-secondary">
                  <em>This name will appear in headings and menus to identify your team. Your company name is probably a good choice, but it doesn&rsquo;t need to be official or anything.</em>
                </div>
                <div><br/></div>
                <OpseeBoundField bf={this.state.info.boundField('subdomain')}/>
                <div className="text-sm text-secondary">
                  <em>The web address you'll use to access your team's account. Keep it short and memorable. Only lowercase letters, numbers, and dashes are allowed, and it must start with a letter.</em>
                </div>
                <div><br/></div>
                <button type="submit" className="btn btn-raised btn-success btn-block ng-disabled" disabled={this.disabled()}>
                  <span>
                    {this.btnText()}
                  </span>
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