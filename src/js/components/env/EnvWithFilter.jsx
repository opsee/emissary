import React from 'react';
import _ from 'lodash';
import forms from 'newforms';
import colors from 'seedling/colors';
import fuzzy from 'fuzzy';
import Immutable, {Record, List, Map} from 'immutable';
import {Link} from 'react-router';

import router from '../../modules/router';
import config from '../../modules/config';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';

import {BoundField, Button} from '../forms';
import {StatusHandler} from '../global';
import {Close, Add} from '../icons';
import {UserActions, GroupActions, InstanceActions} from '../../actions';
import {GroupStore, CheckStore, InstanceStore} from '../../stores';
import {GroupItemList} from '../groups';
import {InstanceItemList} from '../instances';

const FilterForm = forms.Form.extend({
  filter: forms.CharField({
    label:'Filter',
    widgetAttrs:{
      placeholder:'group:target-group'
    },
    required:false
  }),
  render() {
    return <BoundField bf={this.boundField('filter')}/>
  }
});

const EnvWithFilter = React.createClass({
  mixins:[GroupStore.mixin, InstanceStore.mixin],
  storeDidChange(){
    const getGroupsSecurityStatus = GroupStore.getGetGroupsSecurityStatus();
    const getGroupsELBStatus = GroupStore.getGetGroupsELBStatus();
    const getInstancesECCStatus = InstanceStore.getGetInstancesECCStatus();
    let stateObj = {};
    if(getGroupsSecurityStatus == 'success'){
      stateObj.groupsSecurity = GroupStore.getGroupsSecurity();
      stateObj.attemptedGroupsSecurity = true;
    }
    if(getGroupsELBStatus == 'success'){
      stateObj.groupsELB = GroupStore.getGroupsELB();
      stateObj.attemptedGroupsELB = true;
    }
    if(getInstancesECCStatus == 'success'){
      stateObj.instancesECC = InstanceStore.getInstancesECC();
      stateObj.attemptedInstancesECC = true;
    }
    this.setState(_.assign(stateObj,{
      getGroupsSecurityStatus, 
      getGroupsELBStatus,
      getInstancesECCStatus
    }));
  },
  getInitialState() {
    const self = this;
    const obj = {
      filter: new FilterForm({
        onChange:self.filterHasChanged,
        labelSuffix:'',
        validation:{
          on:'blur change',
          onChangeDelay:50
        },
      }),
      groupsSecurity:GroupStore.getGroupsSecurity(),
      groupsELB:GroupStore.getGroupsELB(),
      instancesECC:InstanceStore.getInstancesECC(),
      attemptedGroupsSecurity:false,
      attemptedGroupsELB:false,
      attemptedInstancesECC:false,
      selected:_.get(this.props, 'check.target.id') || null
    }
    //this is a workaround because the library is not working correctly with initial + data formset
    return _.extend(obj, {
      cleanedData:null
    });
  },
  filterHasChanged(){
    this.forceUpdate();
  },
  componentWillMount(){
    GroupActions.getGroupsSecurity();
    GroupActions.getGroupsELB();
    InstanceActions.getInstancesECC();
  },
  submit(e){
    e.preventDefault();
    router.transitionTo('checkCreateRequest');
  },
  finishedAttempt(){
    const case1 = !!(this.state.attemptedGroupsSecurity &&
      this.state.attemptedGroupsELB &&
      this.state.attemptedInstancesECC);
    const case2 = !!this.state.groupsSecurity.size;
    return case1 || case2;
  },
  getGroupsSecurity(){
    const string = this.state.filter.cleanedData.filter;
    if(string){
      const data = this.state.groupsSecurity.filter(sg => {
        return fuzzy.filter(string, [sg.get('name')]).length;
      });
      return data;
    }else{
      return this.state.groupsSecurity;
    }
  },
  getGroupsELB(){
    const string = this.state.filter.cleanedData.filter;
    if(string){
      return this.state.groupsELB.filter(elb => {
        return fuzzy.filter(string, [elb.get('name')]).length;
      });
    }else{
      return this.state.groupsELB;
    }
  },
  getInstances(){
    const string = this.state.filter.cleanedData.filter;
    if(string){
      return this.state.instancesECC.filter(instance => {
        return fuzzy.filter(string, [instance.get('name')]).length;
      });
    }else{
      return this.state.instancesECC;
    }
  },
  renderGroupsSecurity(){
    if(this.state.groupsSecurity.size){
    return (
      <div>
        <h3>Security Groups</h3>
        <GroupItemList groups={this.getGroupsSecurity()} noLink={!!this.props.onSelect} onClick={this.props.onSelect} selected={this.state.selected} noModal={this.props.noModal}/>
      </div>
      )
    }
  },
  renderGroupsELB(){
    if(this.state.groupsELB.size){
      return (
        <div>
          <h3>ELB Groups</h3>
          <GroupItemList groups={this.getGroupsELB()} noLink={!!this.props.onSelect} onClick={this.props.onSelect} selected={this.state.selected} noModal={this.props.noModal}/>
        </div>
      )
    }
  },
  renderInstances(){
    if(this.state.instancesECC.size){
      return (
        <div>
          <h3>Instances</h3>
          <InstanceItemList instances={this.getInstances()} noLink={!!this.props.onSelect} onClick={this.props.onSelect} selected={this.state.selected} noModal={this.props.noModal}/>
        </div>
      )
    }
  },
  render(){
    if(this.finishedAttempt()){
      return (
        <form name="envWithFilterForm">
          {this.state.filter.render()}
          {this.renderGroupsSecurity()}
          {this.renderGroupsELB()}
          {this.renderInstances()}
        </form>
      )
    }else{
      return <StatusHandler status="pending"/>
    }
  },
})

export default EnvWithFilter;