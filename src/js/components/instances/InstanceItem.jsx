import React, {PropTypes} from 'react';
import {Record} from 'immutable';

import {ListItem} from '../global';
import {Add, ListCheckmark, Close} from '../icons';
import {Button} from '../forms';

const InstanceItem = React.createClass({
  propTypes: {
    item: PropTypes.instanceOf(Record).isRequired,
    onClick: PropTypes.func
  },
  getLink(){
    const type = this.props.item.get('type').toLowerCase();
    return `/instance/${type}/${this.props.item.get('id')}`;
  },
  getInfoText(){
    if (this.props.item.get('total')){
      return (
        <span>
          <ListCheckmark inline fill="textSecondary"/>{this.props.item.get('passing')}
          &nbsp;&nbsp;
          <Close inline fill="textSecondary"/>{this.props.item.get('total') - this.props.item.get('passing')}
        </span>
      );
    }else if (this.props.item.get('checks').size){
      return 'Initializing checks';
    }
    return (
      <span>
        <ListCheckmark inline fill="textSecondary"/>No checks
      </span>
    );
  },
  render(){
    if (this.props.item.get('name')){
      return (
        <ListItem type="Group" link={this.getLink()} params={{id: this.props.item.get('id'), name: this.props.item.get('name')}} onClick={this.props.onClick} state={this.props.item.state} item={this.props.item}>
          <div key="menu">
            <Button color="primary" text="left" to={`/check-create/request?id=${this.props.item.get('id')}&type=${this.props.item.get('type')}&name=${this.props.item.get('name')}`} block flat>
              <Add inline fill="primary"/> Create Check
            </Button>
          </div>
            <div key="line1">{this.props.item.get('name')}</div>
            <div key="line2">{this.getInfoText()}</div>
        </ListItem>
      );
    }
    return <div/>;
  }
});

export default InstanceItem;