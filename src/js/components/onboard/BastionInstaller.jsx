import React, {PropTypes} from 'react';
import Toolbar from '../global/Toolbar.jsx';
import OnboardStore from '../../stores/Onboard';
import OnboardActions from '../../actions/Onboard';
import AWSStore from '../../stores/AWS';
import Link from 'react-router/lib/components/Link';
import forms from 'newforms';
import OpseeBoundField from '../forms/OpseeBoundField.jsx';
import _ from 'lodash';
import router from '../../router.jsx';
import {Close, ChevronRight} from '../icons/Module.jsx';
import ProgressBar from '../global/ProgressBar.jsx';
import {Checkmark} from '../icons/Module.jsx';

const BastionInstaller = React.createClass({
  getInitialState() {
    return _.cloneDeep(this.props);
  },
  getItemTypes(){
    return ['AWS::CloudFormation::Stack','AWS::EC2::SecurityGroup','AWS::IAM::Role','AWS::IAM::InstanceProfile','AWS::EC2::Instance'];
  },
  getDefaults(){
    return {
      instance_id:null,
      status:'progress',
      items:['AWS::CloudFormation::Stack','AWS::EC2::SecurityGroup','AWS::IAM::Role','AWS::IAM::InstanceProfile','AWS::EC2::Instance'].map(i => {
        return {id:i,msgs:[]}
      })
    }
  },
  // function bastionInstaller(obj){
  //   _.extend(this,obj);
  //   _.defaults(this,defaults);
  // }
  parseMsg(msg){
    const self = this;
    let item = _.findWhere(self.items,{id:msg.attributes.ResourceType});
    if(!item){
      self.items.push({
        id:msg.attributes.ResourceType,
        msgs:[]
      });
    }
    item = _.findWhere(self.items,{id:msg.attributes.ResourceType});
    item.msgs.push(msg.attributes);
    item.msgs = item.msgs.sort(function(a,b){
      return Date.parse(a.Timestamp) - Date.parse(b.Timestamp)
    });
  },
  getItemStatuses(){
    return _.chain(this.items).map(i => {
      return _.last(i.msgs) || {ResourceStatus:'CREATE_IN_PROGRESS', ResourceType:i.id};
    }).compact().value();
  },
  getStatus(){
    const statuses = this.getItemStatuses();
    const progressItems = _.reject(statuses, {ResourceStatus:'CREATE_COMPLETE'});
    let string;
    if(!progressItems.length && statuses.length){
      string = 'complete';
    }else if(statuses.length){
      const rollback = _.findWhere(statuses,{ResourceStatus:'ROLLBACK_COMPLETE'});
      const deleting = _.findWhere(statuses,{ResourceStatus:'DELETE_COMPLETE'});
      if(rollback){
        string = 'rollback';
      }else if(deleting){
        string = 'deleting';
      }else{
        string = 'progress';
      }
    }else{
      string = 'progress';
    }
    return string;
  },
  getInProgressItem(){
    const statuses = this.getItemStatuses();
    const index = _.findLastIndex(statuses,{ResourceStatus:'CREATE_COMPLETE'}) + 1;
    return (index > 0 && index < statuses.length) ? statuses[index] : {ResourceType:'AWS::EC2::SecurityGroup'};
  },
  getPercentComplete(){
    const statuses = this.getItemStatuses();
    const complete = _.where(statuses,{ResourceStatus:'CREATE_COMPLETE'}).length;
    const num = (complete/this.items.length)*100;
    return num;
  },
  isComplete(){
    return false;
  },
  // getInProgressItem(){
  //   return {
  //     ResourceType:'hey'
  //   }
  // },
  render() {
    return (
      <div className="padding-bx2">
        <h2>{this.id}</h2>
        <ProgressBar percentage={this.getPercentComplete()}/>
        <div style="text-align: center;">
          <div ng-if="bastion.getStatus() == 'progress'"><img style="height: 24px; width: 24px; margin-right: 12px;" src="/public/img/tailspin_icon.svg" className="status_icon tailspin" alt="loading icon"/> 
          Setting up {this.getInProgressItem().ResourceType}.</div>
          <div ng-if="bastion.getStatus() == 'deleting'"><img style="height: 24px; width: 24px; margin-right: 12px;" src="/public/img/tailspin_icon.svg" className="status_icon tailspin" alt="loading icon"/>Failed, cleaning up.</div>
          <div ng-if="bastion.getStatus() == 'rollback'">Failed. Cleanup complete.</div>
          <div ng-if="bastion.getStatus() == 'complete'"><Checkmark/>Complete.</div>
        </div>
      </div>
    );
  }
});

export default BastionInstaller;