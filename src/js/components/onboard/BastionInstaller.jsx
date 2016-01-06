import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Padding} from '../layout';
import {ProgressBar} from '../global';

const itemTypes = ['AWS::CloudFormation::Stack', 'AWS::IAM::Role', 'AWS::EC2::SecurityGroup', 'AWS::IAM::InstanceProfile', 'AWS::EC2::Instance'];

const BastionInstaller = React.createClass({
  propTypes: {
    messages: PropTypes.array,
    connected: PropTypes.bool
  },
  getDefaultProps(){
    return {
      id: null,
      messages: [],
      connected: PropTypes.bool
    };
  },
  getInProgressItem(){
    if (this.props.connected){
      return 'Connected';
    }
    const items = this.getItems();

    const rollback = _.findWhere(items, {status: 'ROLLBACK_COMPLETE'});
    if (rollback){
      return 'Rollback';
    }
    const deleting = _.findWhere(items, {status: 'DELETE_COMPLETE'});
    if (deleting){
      return 'Deleting';
    }

    const index = _.findLastIndex(items, {status: 'CREATE_COMPLETE'});
    if (index > -1){
      if (index + 1 < items.length){
        return items[index + 1].ResourceType;
      }
      if (items[0].status !== 'CREATE_COMPLETE'){
        return 'Cloud Finishing';
      }else if (items[0].status === 'CREATE_COMPLETE'){
        return 'Complete';
      }
      return 'AWS::CloudFormation::Stack';
    }
    if (!items[1].status){
      return 'Reading';
    }
    return 'AWS::IAM::Role';
  },
  getPercentComplete(){
    const num = this.getText().num;
    if (num && num > 0){
      return (num / 8) * 100;
    }
    return num;
  },
  getItemStatus(msgs){
    const last = _.last(msgs);
    return last ? last.ResourceStatus : false;
  },
  getItems(){
    return itemTypes.map(i => {
      return {
        ResourceType: i,
        status: this.getItemStatus(_.filter(this.props.messages, {ResourceType: i}))
      };
    });
  },
  getText(){
    const item = this.getInProgressItem();
    let num;
    let string;
    switch (item){
    case 'Connected':
      num = 8;
      string = 'Bastion installed and connected.';
      break;
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
      string = 'Finishing CloudFormation setup.';
      break;
    case 'Complete':
      num = 7;
      string = 'Bastion successfully installed. Waiting for connection to Opsee...';
      break;
    case 'Deleting':
      num = 0;
      string = 'Bastion install failed. Cleaning up.';
      break;
    case 'Rollback':
      num = -1;
      string = 'Bastion install failed. Finished with cleanup.';
      break;
    default:
      break;
    }
    if (num && num < 8 && num > 0){
      string = `(${num}/8) ${string}`;
    }
    return {string, num};
  },
  render() {
    return (
      <Padding b={2}>
        <h2>{this.id}</h2>
        <ProgressBar percentage={this.getPercentComplete()} steps={8}/>
        <div style={{textAlign: 'center'}}>
        {this.getText().string}
        </div>
      </Padding>
    );
  }
});

export default BastionInstaller;