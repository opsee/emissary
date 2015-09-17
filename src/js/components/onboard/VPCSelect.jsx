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
    const regionsWithVpcs = OnboardStore.getAvailableVpcs()
    if(regionsWithVpcs.length){
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
      this.setState({vpcs:vpcs});
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
      status:'pending',
      vpcs:[]
    });
  },
  submit(e){
    e.preventDefault();
    OnboardActions.onboardSetVpcs(this.state.info.cleanedData.vpcs);
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
    if(this.state.vpcs.length){
      return (
        <div>
          <p>Here are the active VPCs Opsee found in the regions you chose. Choose which VPC you&rsquo;d like to install a Bastion in.</p>
          <BoundField bf={this.state.info.boundField('vpcs')}/>
          <div><br/></div>
          <button type="submit" className="btn btn-raised btn-success btn-block ng-disabled" disabled={this.disabled()}>Install</button>
        </div>
      )
    }else{
      return (
        <Alert type="danger">
          Either you have no active VPCs or something else went wrong.
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
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Team;