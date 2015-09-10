import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import {Alert} from '../global';
import {OnboardStore, AWSStore} from '../../stores';
import {OnboardActions} from '../../actions';
import {Link} from 'react-router';
import forms from 'newforms';
import {BoundField} from '../forms';
import _ from 'lodash';
import $q from 'q';
import router from '../../modules/router';
import {Grid, Row, Col} from '../../modules/bootstrap';

const regions = AWSStore.getRegions();

const InfoForm = forms.Form.extend({
  vpcs: forms.ChoiceField({
    choices:[],
    widget: forms.RadioSelect
  }),
});

const Team = React.createClass({
  mixins: [OnboardStore.mixin],
  storeDidChange(){
    this.setVpcs();
    const data = OnboardStore.getInstallData();
    const dataHasValues = _.chain(data).values().every(_.identity).value();
    if(dataHasValues && data.regions.length && data.vpcs.length){
      // OnboardActions.onboardSetVpcs()
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
          let name = v['vpc-id'];
          if(v.tags){
            let nameTag = _.findWhere(v.tags, {key:'Name'});
            if(nameTag){
              name = `${nameTag.value} - ${v['vpc-id']}`;
            }
          }
          return [v['vpc-id'], `${name} (${r.region})`];
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
    return _.extend(obj, {
      status:'pending'
    });
  },
  // componentWillMount(){
  //   OnboardActions.onboardVpcScan(OnboardStore.getInstallData());
  // },
  submit(e){
    e.preventDefault();
    OnboardActions.onboardSetVpcs(this.state.info.cleanedData.vpcs);
    // router.transitionTo('onboardInstall');
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
    }else if(this.state.status == 'success'){
      return (
        <div>
          <p>Here are the active VPCs Opsee found in the regions you chose. Choose which VPC you&rsquo;d like to install a Bastion in.</p>
          <BoundField bf={this.state.info.boundField('vpcs')}/>
          <div><br/></div>
          <button type="submit" className="btn btn-raised btn-success btn-block ng-disabled" disabled={this.disabled()}>Install</button>
        </div>
      )
    }else if(this.state.status != 'pending'){
      return (
        <Alert type="danger">
          {this.state.status && this.state.status.body && this.state.status.body.error}
        </Alert>
      )
    }
  },
  render() {
    return (
       <div>
        <Toolbar title="Select a VPC"/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <form name="loginForm" onSubmit={this.submit}>
              {this.innerRender()}
              </form>
              {
              // <pre>{JSON.stringify(this.state.info.cleanedData, null, ' ')}</pre>
              }
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Team;