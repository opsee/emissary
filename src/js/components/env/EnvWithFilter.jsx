import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import colors from 'seedling/colors';
import fuzzy from 'fuzzy';
import Immutable, {Record, List, Map} from 'immutable';
import {Link} from 'react-router';
import {Search} from '../icons';

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
      placeholder:'What are you looking for?',
      noLabel: true
    },
    required:false
  }),
  render() {
    return (
      <BoundField bf={this.boundField('filter')}>
        <Search className="icon"/>
      </BoundField>
    )
  }
});

const EnvWithFilter = React.createClass({
  mixins:[GroupStore.mixin, InstanceStore.mixin],
  propTypes:{
    include:PropTypes.array
  },
  storeDidChange(){
    const getGroupsSecurityStatus = GroupStore.getGetGroupsSecurityStatus();
    const getGroupsELBStatus = GroupStore.getGetGroupsELBStatus();
    const getInstancesECCStatus = InstanceStore.getGetInstancesECCStatus();
    let stateObj = {};
    if(getGroupsSecurityStatus == 'success'){
      stateObj.attemptedGroupsSecurity = true;
    }
    if(getGroupsELBStatus == 'success'){
      stateObj.attemptedGroupsELB = true;
    }
    if(getInstancesECCStatus == 'success'){
      stateObj.attemptedInstancesECC = true;
    }
    this.setState(_.assign(stateObj,{
      getGroupsSecurityStatus,
      getGroupsELBStatus,
      getInstancesECCStatus
    }));
  },
  getDefaultProps(){
    return {
      include:['groupsSecurity', 'groupsELB', 'instancesECC']
    }
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
    const case2 = !!GroupStore.getGroupsSecurity().size;
    return case1 || case2;
  },
  getGroupsSecurity(){
    const string = this.state.filter.cleanedData.filter;
    if(string){
      const data = GroupStore.getGroupsSecurity().filter(sg => {
        return fuzzy.filter(string, [sg.get('name')]).length;
      }).sortBy(sg => {
        return sg.get('health');
      })
      return data;
    }else{
      return GroupStore.getGroupsSecurity().sortBy(sg => {
        return sg.get('health');
      })
    }
  },
  getGroupsELB(){
    const string = this.state.filter.cleanedData.filter;
    if(string){
      return GroupStore.getGroupsELB().filter(elb => {
        return fuzzy.filter(string, [elb.get('name')]).length;
      });
    }else{
      return GroupStore.getGroupsELB();
    }
  },
  getInstances(){
    const string = this.state.filter.cleanedData.filter;
    if(string){
      return InstanceStore.getInstancesECC().filter(instance => {
        return fuzzy.filter(string, [instance.get('name')]).length;
      });
    }else{
      return InstanceStore.getInstancesECC();
    }
  },
  renderGroupsSecurity(){
    if(GroupStore.getGroupsSecurity().size){
    return (
      <div>
        <h3>Security Groups ({this.getGroupsSecurity().size})</h3>
        <GroupItemList groups={this.getGroupsSecurity()} noLink={!!this.props.onSelect} onClick={this.props.onSelect} selected={this.state.selected} noModal={this.props.noModal} linkInsteadOfMenu={!!this.props.onSelect}/>
      </div>
      )
    }
  },
  renderGroupsELB(){
    if(GroupStore.getGroupsELB().size){
      return (
        <div>
          <h3>ELBs ({this.getGroupsELB().size})</h3>
          <GroupItemList groups={this.getGroupsELB()} noLink={!!this.props.onSelect} onClick={this.props.onSelect} selected={this.state.selected} noModal={this.props.noModal} linkInsteadOfMenu={!!this.props.onSelect}/>
        </div>
      )
    }
  },
  renderInstancesECC(){
    if(InstanceStore.getInstancesECC().size){
      return (
        <div>
          <h3>Instances ({InstanceStore.getInstancesECC().size})</h3>
          <InstanceItemList instances={this.getInstances()} noLink={!!this.props.onSelect} onClick={this.props.onSelect} selected={this.state.selected} noModal={this.props.noModal} linkInsteadOfMenu={!!this.props.onSelect}/>
        </div>
      )
    }
  },
  render(){
    const self = this;
    if(this.finishedAttempt()){
      return (
        <form name="envWithFilterForm">
          {this.state.filter.render()}
          {this.renderGroupsSecurity()}
          <hr/>
          {this.renderGroupsELB()}
          <hr/>
          {this.renderInstancesECC()}
        </form>
      )
    }else{
      return <StatusHandler status="pending"/>
    }
  },
})

export default EnvWithFilter;