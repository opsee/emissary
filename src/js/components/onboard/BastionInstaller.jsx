import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Padding} from '../layout';
import {ProgressBar} from '../global';
import {Heading} from '../type';

const itemTypes = ['AWS::CloudFormation::Stack', 'AWS::EC2::SecurityGroup', 'AWS::EC2::Instance'];

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

    const rollback = _.find(items, {status: 'ROLLBACK_COMPLETE'});
    if (rollback){
      return 'Rollback';
    }
    const deleting = _.find(items, {status: 'DELETE_COMPLETE'});
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
      } else if (items[0].status === 'CREATE_COMPLETE'){
        return 'Complete';
      }
      return 'AWS::CloudFormation::Stack';
    }
    if (!items[1].status){
      return 'Reading';
    }
    return 'AWS::EC2::SecurityGroup';
  },
  getPercentComplete(){
    const num = this.getText().num;
    if (num && num > 0){
      return (num / 6) * 100;
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
      num = 6;
      string = 'The Opsee instance is installed and connected.';
      break;
    case 'Reading':
      num = 1;
      string = 'Reading CloudFormation template.';
      break;
    case 'AWS::EC2::SecurityGroup':
      num = 2;
      string = 'Creating Security Group.';
      break;
    case 'AWS::EC2::Instance':
      num = 3;
      string = 'Launching Instance.';
      break;
    case 'Cloud Finishing':
      num = 4;
      string = 'Finishing CloudFormation setup.';
      break;
    case 'Complete':
      num = 5;
      string = 'The Opsee instance is successfully installed. Waiting for connection to Opsee...';
      break;
    case 'Deleting':
      num = 0;
      string = 'Instance install failed. Cleaning up.';
      break;
    case 'Rollback':
      num = -1;
      string = 'Instance install failed. Finished with cleanup.';
      break;
    default:
      break;
    }
    if (num && num < 6 && num > 0){
      string = `(${num}/6) ${string}`;
    }
    return {string, num};
  },
  render() {
    return (
      <div>
        <Heading level={2}>{this.id}</Heading>
        <Padding b={2} className="text-center">
          {this.getText().string}
        </Padding>
        <ProgressBar percentage={this.getPercentComplete()} steps={6}/>
      </div>
    );
  }
});

export default BastionInstaller;