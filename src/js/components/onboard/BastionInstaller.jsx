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

const itemTypes = ['AWS::CloudFormation::Stack','AWS::IAM::Role','AWS::EC2::SecurityGroup','AWS::IAM::InstanceProfile','AWS::EC2::Instance'];

const BastionInstaller = React.createClass({
  getDefaultProps(){
    return {
      id:null,
      messages:[]
    }
  },
  getInProgressItem(){
    const items = this.getItems();

    const rollback = _.findWhere(items,{status:'ROLLBACK_COMPLETE'});
    if(rollback){
      return 'Rollback';
    }
    const deleting = _.findWhere(items,{status:'DELETE_COMPLETE'});
    if(deleting){
      return 'Deleting';
    }

    const index = _.findLastIndex(items, {status:'CREATE_COMPLETE'});
    if(index > -1){
      if(index+1 < items.length){
        return items[index+1].ResourceType;
      }
      if(items[0].status != 'CREATE_COMPLETE'){
        return 'Cloud Finishing';
      }else if(items[0].status == 'CREATE_COMPLETE'){
        return 'Complete';
      }
      return 'AWS::CloudFormation::Stack';
    }else{
      if(!items[1].status){
        return 'Reading';
      }
    }
    return 'AWS::IAM::Role';
    // return index > -1 ? items[index+1].ResourceType : 'Group';
    // return (index > 0 && index < items.length) ? items[index+1].ResourceType : '';
  },
  getPercentComplete(){
    const num = this.getText().num;
    if(num && num > 0){
      return (num / 7)*100;
    }else{
      return num;
    }
  },
  getItemStatus(msgs){
    const last = _.last(msgs);
    return last ? last.ResourceStatus : false;
  },
  getItems(){
    return itemTypes.map(i => {
      return {
        ResourceType:i,
        status:this.getItemStatus(_.filter(this.props.messages, {ResourceType:i}))
      }
    })
  },
  getText(){
    const item = this.getInProgressItem();
    let num;
    let string;
    switch(item){
      case 'Reading':
        num = 1;
        string = 'Reading CloudFormation template';
      break;
      case 'AWS::IAM::Role':
        num = 2;
        string = 'Creating Instance Role';
      break;
      case 'AWS::EC2::SecurityGroup':
        num = 3;
        string = 'Creating Security Group';
      break;
      case 'AWS::IAM::InstanceProfile':
        num = 4;
        string = 'Creating Instance Profile';
      break;
      case 'AWS::EC2::Instance':
        num = 5;
        string = 'Launching Instance.';
      break;
      case 'Cloud Finishing':
        num = 6;
        string = 'Finishing CloudFormation setup.'
      break;
      case 'Complete':
        num = 7;
        string = 'Bastion successfully installed.'
      break;
      case 'Deleting':
        num = 0;
        string = 'Bastion install failed. Cleaning up.'
      break;
      case 'Rollback':
        num = -1
        string = 'Bastion install failed. Finished with cleanup.'
      break;
    }
    if(num && num < 7 && num > 0){
      string = `(${num}/7) ${string}`;
    }
    return {string, num};
  },
  // getItemStatuses(){
  //   return this.getItems().map(i => {
  //     return _.last(i) || {ResourceStatus:'CREATE_IN_PROGRESS', ResourceType:i.id};
  //   })
  // },
  // getLatestItem(){
  //   return _.last(this.props.messages) || {
  //     ResourceType:'CloudFormation'
  //   }
  // },
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
        <ProgressBar percentage={this.getPercentComplete()} steps={7}/>
        <div style={{textAlign:'center'}}>
        {
          // <div ng-if="bastion.getStatus() == 'progress'"><img style={{height:'24px',width:'24px',marginRight:'12px'}} src="/public/img/tailspin_icon.svg" className="status_icon tailspin" alt="loading icon"/> 
          // Setting up {this.getInProgressItem()}.</div>
          // <div ng-if="bastion.getStatus() == 'deleting'"><img style={{height:'24px',width:'24px',marginRight:'12px'}} src="/public/img/tailspin_icon.svg" className="status_icon tailspin" alt="loading icon"/>Failed, cleaning up.</div>
          // <div ng-if="bastion.getStatus() == 'rollback'">Failed. Cleanup complete.</div>
          // <div ng-if="bastion.getStatus() == 'complete'"><Checkmark/>Complete.</div>
        }
        {this.getText().string}
          <div>{
            // this.getStatus()
          }</div>
        </div>
      </div>
    );
  }
});

export default BastionInstaller;