import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import fuzzy from 'fuzzy';
import {List} from 'immutable';

import {Row, Col} from '../../modules/bootstrap';
import {SetInterval} from '../../modules/mixins';

import {BoundField, Button} from '../forms';
import {StatusHandler} from '../global';
import {Search} from '../icons';
import {GroupActions, InstanceActions} from '../../actions';
import {GroupStore, InstanceStore} from '../../stores';
import {GroupItemList} from '../groups';
import {InstanceItemList} from '../instances';
import {Padding} from '../layout';

const FilterForm = forms.Form.extend({
  filter: forms.CharField({
    label: 'Filter',
    widgetAttrs: {
      placeholder: 'What are you looking for?',
      noLabel: true
    },
    required: false
  }),
  render() {
    return (
      <BoundField bf={this.boundField('filter')} className="padding-b">
        <Search className="icon"/>
      </BoundField>
    );
  }
});

const EnvWithFilter = React.createClass({
  mixins: [GroupStore.mixin, InstanceStore.mixin, SetInterval],
  propTypes: {
    include: PropTypes.array,
    filter: PropTypes.string,
    onFilterChange: PropTypes.func,
    onTargetSelect: PropTypes.func,
    noModal: PropTypes.bool
  },
  getDefaultProps(){
    return {
      include: ['groupsSecurity', 'groupsELB', 'instancesECC']
    };
  },
  getInitialState() {
    const self = this;
    const obj = {
      filter: new FilterForm(_.assign({
        onChange: self.onFilterChange,
        labelSuffix: '',
        validation: {
          on: 'blur change',
          onChangeDelay: 50
        }
      }, this.props.filter ? {data: {filter: this.props.filter}} : null)),
      attemptedGroupsSecurity: false,
      attemptedGroupsELB: false,
      attemptedInstancesECC: false,
      selected: _.get(this.props, 'check.target.id') || null
    };
    //this is a workaround because the library is not working correctly with initial + data formset
    if (this.props.filter){
      setTimeout(() => {
        this.state.filter.setData({filter: this.props.filter});
      }, 50);
    }
    return _.extend(obj, {
      cleanedData: null
    });
  },
  componentWillMount(){
    this.getData();
    this.setInterval(this.getData, 15000);
  },
  storeDidChange(){
    const getGroupsSecurityStatus = GroupStore.getGetGroupsSecurityStatus();
    const getGroupsELBStatus = GroupStore.getGetGroupsELBStatus();
    const getInstancesECCStatus = InstanceStore.getGetInstancesECCStatus();
    let stateObj = {};
    if (getGroupsSecurityStatus === 'success'){
      stateObj.attemptedGroupsSecurity = true;
    }
    if (getGroupsELBStatus === 'success'){
      stateObj.attemptedGroupsELB = true;
    }
    if (getInstancesECCStatus === 'success'){
      stateObj.attemptedInstancesECC = true;
    }
    this.setState(_.assign(stateObj, {
      getGroupsSecurityStatus,
      getGroupsELBStatus,
      getInstancesECCStatus
    }));
  },
  getData(){
    GroupActions.getGroupsSecurity();
    GroupActions.getGroupsELB();
    InstanceActions.getInstancesECC();
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
      return item.get('state') === 'passing';
    }).size;
  },
  getNumberFailing(){
    return this.getAll().filter(item => {
      return item.get('state') === 'failing';
    }).size;
  },
  getNumberUnmonitored(){
    return this.getAll().filter(item => {
      return item.get('state') === 'running';
    }).size;
  },
  getGroupsSecurity(ignoreButtonState){
    const string = this.state.filter.cleanedData.filter;
    let data = GroupStore.getGroupsSecurity().sortBy(sg => {
      return sg.get('health') || 101;
    });
    if (this.state.buttonSelected && !ignoreButtonState){
      data = data.filter(sg => {
        return sg.get('state') === this.state.buttonSelected;
      });
    }
    if (string){
      return data.filter(sg => {
        return fuzzy.filter(string, [sg.get('name')]).length;
      });
    }
    return data;
  },
  getGroupsELB(ignoreButtonState){
    const string = this.state.filter.cleanedData.filter;
    let data = GroupStore.getGroupsELB().sortBy(elb => {
      return elb.get('health') || 101;
    });
    if (this.state.buttonSelected && !ignoreButtonState){
      data = data.filter(elb => {
        return elb.get('state') === this.state.buttonSelected;
      });
    }
    if (string){
      return data.filter(elb => {
        return fuzzy.filter(string, [elb.get('name')]).length;
      });
    }
    return data;
  },
  getInstances(ignoreButtonState){
    const string = this.state.filter.cleanedData.filter;
    let data = InstanceStore.getInstancesECC().sortBy(instance => {
      return instance.get('health') || 101;
    });
    if (this.state.buttonSelected && !ignoreButtonState){
      data = data.filter(instance => {
        return instance.get('state') === this.state.buttonSelected;
      });
    }
    if (string){
      return data.filter(instance => {
        return fuzzy.filter(string, [instance.get('name')]).length;
      });
    }
    return data;
  },
  getItemTypeFromSlug(slug){
    switch (slug){
    case 'groupsSecurity':
      return {
        name: 'Security Groups',
        fn: GroupStore.getGroupsSecurity
      };
    case 'groupsELB':
      return {
        name: 'ELB Groups',
        fn: GroupStore.getGroupsELB
      };
    case 'instancesECC':
      return {
        name: 'Instances',
        fn: InstanceStore.getInstancesECC
      };
    default:
      break;
    }
  },
  isFinishedAttempt(){
    const case1 = !!(this.state.attemptedGroupsSecurity &&
      this.state.attemptedGroupsELB &&
      this.state.attemptedInstancesECC);
    const case2 = !!GroupStore.getGroupsSecurity().size;
    return case1 || case2;
  },
  onFilterChange(){
    this.forceUpdate();
    if (this.props.onFilterChange){
      this.props.onFilterChange.call(null, this.state.filter.cleanedData.filter);
    }
  },
  runToggleButtonState(string){
    const state = this.state.buttonSelected;
    let obj = {};
    if (state === string){
      obj.buttonSelected = false;
    }else {
      obj.buttonSelected = string;
    }
    this.setState(obj);
  },
  renderGroupsSecurity(){
    if (GroupStore.getGroupsSecurity().size){
      return (
        <div>
          <h3>Security Groups ({this.getGroupsSecurity().size})</h3>
          <GroupItemList groups={this.getGroupsSecurity()} noLink={!!this.props.onTargetSelect} onClick={this.props.onTargetSelect} selected={this.state.selected} noModal={this.props.noModal} linkInsteadOfMenu={!!this.props.onTargetSelect}/>
          <hr/>
        </div>
      );
    }
  },
  renderGroupsELB(){
    if (GroupStore.getGroupsELB().size){
      return (
        <div>
          <h3>ELBs ({this.getGroupsELB().size})</h3>
          <GroupItemList groups={this.getGroupsELB()} noLink={!!this.props.onTargetSelect} onClick={this.props.onTargetSelect} selected={this.state.selected} noModal={this.props.noModal} linkInsteadOfMenu={!!this.props.onTargetSelect}/>
          <hr/>
        </div>
      );
    }
  },
  renderInstancesECC(){
    if (InstanceStore.getInstancesECC().size){
      return (
        <div>
          <h3>Instances ({InstanceStore.getInstancesECC().size})</h3>
          <InstanceItemList instances={this.getInstances()} noLink={!!this.props.onTargetSelect} onClick={this.props.onTargetSelect} selected={this.state.selected} noModal={this.props.noModal} linkInsteadOfMenu={!!this.props.onTargetSelect}/>
          <hr/>
        </div>
      );
    }
  },
  renderFilterButtons(){
    return (
      <Row>
        <Col className="col-xs">
          <Padding b={1}>
            <Button color={this.state.buttonSelected === 'passing' ? 'success' : 'default'} onClick={this.runToggleButtonState.bind(null, 'passing')}>Passing - {this.getNumberPassing()}</Button>
          </Padding>
        </Col>
        <Col className="col-xs">
          <Padding b={1}>
            <Button color={this.state.buttonSelected === 'failing' ? 'danger' : 'default'} onClick={this.runToggleButtonState.bind(null, 'failing')}>Failing - {this.getNumberFailing()}</Button>
          </Padding>
        </Col>
        <Col className="col-xs">
          <Padding b={1}>
            <Button color={this.state.buttonSelected === 'running' ? 'primary' : 'default'} onClick={this.runToggleButtonState.bind(null, 'running')}>Unmonitored - {this.getNumberUnmonitored()}</Button>
          </Padding>
        </Col>
      </Row>
    );
  },
  render(){
    const self = this;
    if (this.isFinishedAttempt()){
      return (
        <form name="envWithFilterForm">
          {this.state.filter.render()}
          {this.renderFilterButtons()}
          {this.props.include.map(i => {
            return self[`render${_.capitalize(i)}`]();
          })}
        </form>
      );
    }
    return <StatusHandler status="pending"/>;
  }
});

export default EnvWithFilter;