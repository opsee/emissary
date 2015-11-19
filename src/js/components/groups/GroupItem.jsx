import React, {PropTypes} from 'react';
import _ from 'lodash';
import {Record, Map} from 'immutable';

import {ListItem} from '../global';
import {Add, Checkmark, Close, Instance} from '../icons';
import {Button} from '../forms';
import {GroupStore} from '../../stores';
import {GroupActions} from '../../actions';

const GroupItem = React.createClass({
  propTypes: {
    item: PropTypes.instanceOf(Record).isRequired,
    onClick: PropTypes.func,
    target: PropTypes.object
  },
  getDefaultProps(){
    return {
      item: GroupStore.getNewGroup()
    };
  },
  componentWillMount(){
    if (_.get(this.props, 'target.type')){
      switch (this.props.target.type){
      case 'elb':
        if (!GroupStore.getGroupsELB().size){
          GroupActions.getGroupsELB();
        }
        break;
      default:
        if (!GroupStore.getGroupsSecurity().size){
          GroupActions.getGroupsSecurity();
        }
        break;
      }
    }
  },
  getItem(){
    if (_.get(this.props, 'target.type')){
      switch (this.props.target.type){
      case 'elb':
        const elb = GroupStore.getGroupsELB().find(group => {
          return group.get('id') === this.props.target.id;
        });
        return elb || new Map();
      default:
        const sg = GroupStore.getGroupsSecurity().find(group => {
          return group.get('id') === this.props.target.id;
        });
        return sg || new Map();
      }
    }
    return this.props.item;
  },
  getLink(){
    let suffix = _.startCase(this.getItem().get('type')).split(' ').join('');
    suffix = suffix.match('Elb') ? 'ELB' : suffix;
    return `group${suffix}`;
  },
  getInfoText(){
    if (this.getItem().get('total')){
      return  (
        <span>
          <span style={{display: 'inline-block', margin: '0 0.5rem 0 0', padding: '0 .4rem'}}>
            <Checkmark inline fill="textSecondary" style={{height: '1.3rem', width: '1.3rem', verticalAlign: 'middle', margin: '0 0.4rem 0 0'}}/>
            {this.props.item.get('passing')}
          </span>
          <span style={{display: 'inline-block', margin: '0 0.5rem 0 0', padding: '0 .4rem'}}>
            <Close inline fill="textSecondary" style={{height: '1.3rem', width: '1.3rem', verticalAlign: 'middle', margin: '0 0.4rem 0 0'}}/>
            {this.props.item.get('total') - this.props.item.get('passing')}
          </span>
          <span style={{display: 'inline-block', margin: '0 0.5rem 0 0', padding: '0 .4rem'}}>
            <Instance inline fill="textSecondary" style={{height: '1.3rem', width: '1.3rem', verticalAlign: 'middle', margin: '0 0.4rem 0 0'}}/>
            {this.props.item.get('instance_count')}
          </span>
        </span>
      );
    }else if (this.getItem().get('checks').size){
      return 'Initializing checks';
    }
    return  (
      <span>
        <Checkmark inline fill="textSecondary" style={{height: '1.3rem', width: '1.3rem', verticalAlign: 'middle', margin: '0 0.4rem 0 0'}}/>
        No checks
        <span style={{display: 'inline-block', margin: '0 .6rem 0 0', padding: '0 .4rem'}}>
          <Instance inline fill="textSecondary" style={{height: '1.3rem', width: '1.3rem', verticalAlign: 'middle', margin: '0 0.4rem 0 0'}}/>
          {this.props.item.get('instance_count')}
        </span>
      </span>
    );
  },
  render(){
    if (this.getItem().get('name')){
      return (
        <ListItem type="Group" link={this.getLink()} params={{id: this.getItem().get('id'), name: this.getItem().get('name')}} onClick={this.props.onClick} state={this.getItem().state} item={this.getItem()} title={`${this.getItem().get('name')} - ${this.getItem().get('instance_count')} instances`}>
          <div key="menu">
            <Button color="primary" text="left" to="checkCreateRequest" block flat query={{target: {id: this.getItem().get('id'), type: this.getItem().get('type'), name: this.getItem().get('name')}}}>
              <Add inline fill="primary"/> Create Check
            </Button>
          </div>
            <div key="line1">{this.getItem().get('name')}</div>
            <div key="line2">{this.getInfoText()}</div>
        </ListItem>
      );
    }
    return <div/>;
  }
});

export default GroupItem;