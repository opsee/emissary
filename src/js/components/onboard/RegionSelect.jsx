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
  regions: forms.MultipleChoiceField({
    choices: regionChoices,
    widget: forms.CheckboxSelectMultiple
  }),
});

const Team = React.createClass({
  mixins: [State, OnboardStore.mixin],
  storeDidChange(){
    const data = OnboardStore.getInstallData();
    if(data && data.regions && data.regions.length){
      router.transitionTo('onboardCredentials'); 
    }
  },
  getInitialState() {
    var self = this;
    var data = OnboardStore.getInstallData();
    const obj = {
      info:new InfoForm({
        onChange(){
          self.forceUpdate();
        },
        labelSuffix:'',
        data: {
          regions:data.regions
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
  submit(e){
    e.preventDefault();
    OnboardActions.onboardSetRegions(this.state.info.cleanedData.regions);
  },
  disabled(){
    return !this.state.info.cleanedData.regions || !this.state.info.cleanedData.regions.length;
  },
  toggleAll(value){
    if(value){
      this.state.info.updateData({
        regions:regions.map(r => {
          return r.id
        })
      })
    }else{
      this.state.info.updateData({regions:[]});
    }
  },
  render() {
    return (
       <div>
        <Toolbar title="Regions to launch Bastions in"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <form name="loginForm" ng-submit="submit()" onSubmit={this.submit}>
               <p>Choose the regions you'd like to launch Opsee bastions in. We're not going to install anything yet, we&rsquo;re first looking for active VPCs and subnets in the regions you select.</p>
               <h2 className="h3">All AWS regions - <button type="button" className="btn btn-flat btn-primary" onClick={this.toggleAll.bind(this, true)}>Select All</button> - <button type="button" className="btn btn-flat btn-warning" onClick={this.toggleAll.bind(null, false)}>Deselect All</button></h2>
                <OpseeBoundField bf={this.state.info.boundField('regions')}/>
                <div><br/></div>
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