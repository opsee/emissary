import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import colors from 'seedling/colors';
import fuzzy from 'fuzzy';
import Immutable, {Record, List, Map} from 'immutable';
import {Link} from 'react-router';

import router from '../../modules/router';
import config from '../../modules/config';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {SetInterval} from '../../modules/mixins';

import {BoundField, Button} from '../forms';
import {StatusHandler, Table} from '../global';
import {Close, Add, Search, Circle} from '../icons';
import {UserActions, GroupActions, InstanceActions} from '../../actions';
import {GroupStore, CheckStore, InstanceStore} from '../../stores';
import {GroupItemList} from '../groups';
import {InstanceItemList} from '../instances';
import {Padding} from '../layout';

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
      <BoundField bf={this.boundField('filter')} className="padding-b">
        <Search className="icon"/>
      </BoundField>
    )
  }
});

const EnvWithFilter = React.createClass({
  mixins:[GroupStore.mixin, InstanceStore.mixin, SetInterval],
  propTypes:{
    include:PropTypes.array,
    filter:PropTypes.string,
    onFilterChange:PropTypes.func
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
      filter: new FilterForm(_.assign({
        onChange:self.filterHasChanged,
        labelSuffix:'',
        validation:{
          on:'blur change',
          onChangeDelay:50
        }
      }, this.props.filter ? {data:{filter:this.props.filter}} : null)),
      attemptedGroupsSecurity:false,
      attemptedGroupsELB:false,
      attemptedInstancesECC:false,
      selected:_.get(this.props, 'check.target.id') || null
    }
    //this is a workaround because the library is not working correctly with initial + data formset
    if(this.props.filter){
      setTimeout(() => {
        this.state.filter.setData({filter:this.props.filter});
      },50);
    }
    return _.extend(obj, {
      cleanedData:null
    });
  },
  filterHasChanged(){
    this.forceUpdate();
    if(this.props.onFilterChange){
      this.props.onFilterChange.call(null, this.state.filter.cleanedData.filter);
    }
  },
  getData(){
    GroupActions.getGroupsSecurity();
    GroupActions.getGroupsELB();
    InstanceActions.getInstancesECC();
  },
  componentWillMount(){
    this.getData();
    this.setInterval(this.getData,15000);
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
  getAll(){
    let arr = new List();
    arr = arr.concat(this.getGroupsSecurity(true));
    arr = arr.concat(this.getGroupsELB(true));
    arr = arr.concat(this.getInstances(true));
    return arr;
  },
  getNumberPassing(){
    return this.getAll().filter(item => {
      return item.get('state') == 'passing';
    }).size;
  },
  getNumberFailing(){
    return this.getAll().filter(item => {
      return item.get('state') == 'failing';
    }).size;
  },
  getNumberUnmonitored(){
    return this.getAll().filter(item => {
      return item.get('state') == 'running';
    }).size;
  },
  getGroupsSecurity(ignoreButtonState){
    const string = this.state.filter.cleanedData.filter;
    let data = GroupStore.getGroupsSecurity().sortBy(sg => {
      return sg.get('health');
    });
    if(this.state.buttonSelected && !ignoreButtonState){
      data = data.filter(sg => {
        return sg.get('state') == this.state.buttonSelected;
      });
    }
    if(string){
      return data.filter(sg => {
        return fuzzy.filter(string, [sg.get('name')]).length;
      })
    }
    return data;
  },
  getGroupsELB(ignoreButtonState){
    const string = this.state.filter.cleanedData.filter;
    let data = GroupStore.getGroupsELB().sortBy(elb => {
      return elb.get('health');
    });
    if(this.state.buttonSelected && !ignoreButtonState){
      data = data.filter(elb => {
        return elb.get('state') == this.state.buttonSelected;
      });
    }
    if(string){
      return data.filter(elb => {
        return fuzzy.filter(string, [elb.get('name')]).length;
      });
    }
    return data;
  },
  getInstances(ignoreButtonState){
    const string = this.state.filter.cleanedData.filter;
    let data = InstanceStore.getInstancesECC();
    if(this.state.buttonSelected && !ignoreButtonState){
      data = data.filter(instance => {
        return instance.get('state') == this.state.buttonSelected;
      });
    }
    if(string){
      return data.filter(instance => {
        return fuzzy.filter(string, [instance.get('name')]).length;
      });
    }
    return data;
  },
  renderGroupsSecurity(){
    if(GroupStore.getGroupsSecurity().size){
    return (
      <div>
        <Padding b={1}>
          <h3>Security Groups ({this.getGroupsSecurity().size})</h3>
          <GroupItemList groups={this.getGroupsSecurity()} noLink={!!this.props.onTargetSelect} onClick={this.props.onTargetSelect} selected={this.state.selected} noModal={this.props.noModal} linkInsteadOfMenu={!!this.props.onTargetSelect}/>
        </Padding>
        <hr/>
      </div>
      )
    }
  },
  renderGroupsELB(){
    if(GroupStore.getGroupsELB().size){
      return (
        <div>
          <Padding b={1}>
            <h3>ELBs ({this.getGroupsELB().size})</h3>
            <GroupItemList groups={this.getGroupsELB()} noLink={!!this.props.onTargetSelect} onClick={this.props.onTargetSelect} selected={this.state.selected} noModal={this.props.noModal} linkInsteadOfMenu={!!this.props.onTargetSelect}/>
          </Padding>
          <hr/>
        </div>
      )
    }
  },
  renderInstancesECC(){
    if(InstanceStore.getInstancesECC().size){
      return (
        <div>
          <Padding b={1}>
            <h3>Instances ({InstanceStore.getInstancesECC().size})</h3>
            <InstanceItemList instances={this.getInstances()} noLink={!!this.props.onTargetSelect} onClick={this.props.onTargetSelect} selected={this.state.selected} noModal={this.props.noModal} linkInsteadOfMenu={!!this.props.onTargetSelect}/>
          </Padding>
          <hr/>
        </div>
      )
    }
  },
  getItemTypeFromSlug(slug){
    switch(slug){
      case 'groupsSecurity':
        return {
          name:'Security Groups',
          fn:GroupStore.getGroupsSecurity
        }
      break;
      case 'groupsELB':
        return {
          name:'ELB Groups',
          fn:GroupStore.getGroupsELB
        }
        return 'ELB Groups'
      break;
      case 'instancesECC':
        return {
          name:'Instances',
          fn:InstanceStore.getInstancesECC
        }
        return 'Instances'
      break;
    }
  },
  toggleButtonState(string){
    const state = this.state.buttonSelected;
    let obj = {};
    if(state == string){
      obj.buttonSelected = false;
    }else{
      obj.buttonSelected = string;
    }
    this.setState(obj);
  },
  renderFilterButtons(){
    return (
      <div>
        <Button flat={true} color={"danger"} onClick={this.toggleButtonState.bind(null, 'failing')}><Circle fill="danger" inline={true}/> {this.getNumberFailing()} Failing</Button>
        <Button flat={true} color={"default"} onClick={this.toggleButtonState.bind(null, 'running')}><Circle fill="textSecondary" inline={true}/> {this.getNumberUnmonitored()} Unmonitored</Button>
      </div>
    )
  },
  render(){
    const self = this;
    if(this.finishedAttempt()){
      return (
        <form name="envWithFilterForm">
          <Padding b={1}>
            {this.state.filter.render()}
          </Padding>
          <Padding b={1}>
            {this.renderFilterButtons()}
          </Padding>
          {this.props.include.map(i => {
            return self[`render${_.capitalize(i)}`]();
          })}
        </form>
      )
    }else{
      return <StatusHandler status="pending"/>
    }
  },
})

export default EnvWithFilter;