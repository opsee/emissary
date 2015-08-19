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
import $q from 'q';
import router from '../../router.jsx';

let checkSubdomainPromise;
let domainPromisesArray = [];

const regions = AWSStore.getRegions();
const regionChoices = regions.map(r => {
  return [r.id, r.name]
});

const InfoForm = forms.Form.extend({
  vpcs: forms.MultipleChoiceField({
    choices:[],
    widget: forms.CheckboxSelectMultiple
  }),
});

const Team = React.createClass({
  mixins: [OnboardStore.mixin],
  storeDidChange(){
    this.setVpcs();
    const data = OnboardStore.getInstallData();
    const dataHasValues = _.chain(data).values().every(_.identity).value();
    if(dataHasValues && data.regions.length && data.vpcs.length){
      router.transitionTo('onboardInstall');
    }
  },
  setVpcs(){
    const status = OnboardStore.getVpcScanStatus();
    this.setState({status});
    if(status == 'success'){
      const regionsWithVpcs = OnboardStore.getAvailableVpcs();
      let vpcs = regionsWithVpcs.map(r => {
        return r.vpcs.map(v => {
          return [v['vpc-id'], r.region];
        });
      });
      vpcs = _.flatten(vpcs);
      this.state.info.fields.vpcs.setChoices(vpcs);
      this.forceUpdate();
    }
  },
  statics:{
    willTransitionTo(transition, params, query){
      const data = OnboardStore.getInstallData();
      const dataHasValues = _.chain(data).values().every(_.identity).value();
      if(!dataHasValues || !data.regions.length){
        transition.redirect('onboardRegionSelect');
      }
    }
  },
  getInitialState() {
    var self = this;
    const obj = {
      info:new InfoForm({
        onChange(){
          self.forceUpdate();
        },
        labelSuffix:'',
        validation:{
          on:'blur change',
          onChangeDelay:100
        },
      })
    }
    return obj;
  },
  componentWillMount(){
    OnboardActions.onboardVpcScan(OnboardStore.getInstallData());
  },
  submit(e){
    e.preventDefault();
    router.transitionTo('onboardCredentials');
  },
  disabled(){
    return !this.state.info.cleanedData.vpcs;
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
  innerRender(){
    if(this.state.status == 'pending'){
      return (
        <div>
          Looking for VPCs...
        </div>
      )
    }else{
      return (
        <div>
          <p>Here are the active VPCs Opsee found in the regions you chose. Choose which VPCs you&rsquo;d like to install bastions in.</p>
         <h2 className="h3">All AWS regions - <button type="button" className="btn btn-flat btn-primary" onClick={this.toggleAll.bind(this, true)}>Select All</button></h2>
          <OpseeBoundField bf={this.state.info.boundField('vpcs')}/>
          <div><br/></div>
          <button type="submit" className="btn btn-raised btn-success btn-block ng-disabled" disabled={this.disabled()}>Install</button>
        </div>
      )
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
              {this.innerRender()}
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