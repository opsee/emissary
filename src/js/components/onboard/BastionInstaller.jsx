import React, {PropTypes} from 'react';
import _ from 'lodash';

import {OnboardStore} from '../../stores';
import {OnboardActions} from '../../actions';

import {Toolbar, ProgressBar} from '../global';
import {Link} from 'react-router';
import forms from 'newforms';
import {BoundField} from '../forms';
import router from '../../modules/router.js';
import {Close, Checkmark, ChevronRight} from '../icons';

const BastionInstaller = React.createClass({
  getInitialState() {
    var obj = _.cloneDeep(this.props);
    return _.extend(obj, {
      instance_id:null,
      status:'progress',
      items:['AWS::CloudFormation::Stack','AWS::EC2::SecurityGroup','AWS::IAM::Role','AWS::IAM::InstanceProfile','AWS::EC2::Instance'].map(i => {
        return {id:i,msgs:[]}
      })
    })
  },
  getItemTypes(){
    return ['AWS::CloudFormation::Stack','AWS::EC2::SecurityGroup','AWS::IAM::Role','AWS::IAM::InstanceProfile','AWS::EC2::Instance'];
  },
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
    const num = (complete/this.state.items.length)*100;
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
        <div style={{textAlign:'center'}}>
          <div ng-if="bastion.getStatus() == 'progress'"><img style={{height:'24px',width:'24px',marginRight:'12px'}} src="/public/img/tailspin_icon.svg" className="status_icon tailspin" alt="loading icon"/> 
          Setting up {this.getInProgressItem().ResourceType}.</div>
          <div ng-if="bastion.getStatus() == 'deleting'"><img style={{height:'24px',width:'24px',marginRight:'12px'}} src="/public/img/tailspin_icon.svg" className="status_icon tailspin" alt="loading icon"/>Failed, cleaning up.</div>
          <div ng-if="bastion.getStatus() == 'rollback'">Failed. Cleanup complete.</div>
          <div ng-if="bastion.getStatus() == 'complete'"><Checkmark/>Complete.</div>
        </div>
      </div>
    );
  }
});

export default BastionInstaller;