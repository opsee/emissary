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
import {SetInterval} from '../../modules/mixins';

import {BoundField, Button} from '../forms';
import {StatusHandler} from '../global';
import {Close, Add} from '../icons';
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
        <hr/>
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
          <hr/>
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
  renderFilterButtons(){
    return (
      <Padding>
        <Button bsStyle="success">Passing</Button>
        <Button bsStyle="alert">Failing</Button>
        <Button bsStyle="primary">Unmonitored</Button>
      </Padding>
    )
  },
  renderTableItem(i){
    const num = this.getItemTypeFromSlug(i).fn().filter(item => item.health < 100).size;
    if(num > 0){
      return (
        <tr>
          <td><strong>Failing {this.getItemTypeFromSlug(i).name}</strong></td>
          <td>{this.getItemTypeFromSlug(i).fn().filter(item => item.health < 100).size}</td>
        </tr>
      )
    }else{
      return (<tr/>)
    }
  },
  shouldRenderTable(){
    return _.chain(this.props.include).map(i => {
      return this.getItemTypeFromSlug(i).fn().filter(item => item.health < 100).size;
    }).compact().value().length;
  },
  renderStatusTable(){
    if(this.shouldRenderTable()){
      return (
        <div className="padding-b">
          <table className="table">
            {this.props.include.map(i => this.renderTableItem(i))}
          </table>
        </div>
      )
    }else{
      return <div/>
    }
  },
  render(){
    const self = this;
    if(this.finishedAttempt()){
      return (
        <form name="envWithFilterForm">
          {this.renderStatusTable()}
          {this.state.filter.render()}
          {this.renderFilterButtons()}
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