import React, {PropTypes} from 'react';
import _ from 'lodash';
import {Record} from 'immutable';

import {ListItem} from '../global';
import {Add} from '../icons';
import {Button} from '../forms';

const InstanceItem = React.createClass({
  propTypes: {
    item: PropTypes.instanceOf(Record).isRequired,
    onClick: PropTypes.func
  },
  getLink(){
    const suffix = _.startCase(this.props.item.get('type')).split(' ').join('');
    return `instance${suffix}`;
  },
  getInfoText(){
    if (this.props.item.get('total')){
      return `${this.props.item.get('passing')} of ${this.props.item.get('total')} passing`;
    }else if (this.props.item.get('checks').size){
      return 'Initializing checks';
    }
    return 'No checks applied';
  },
  render(){
    if (this.props.item.get('name')){
      return (
        <ListItem type="Group" link={this.getLink()} params={{id: this.props.item.get('id'), name: this.props.item.get('name')}} onClick={this.props.onClick} state={this.props.item.state} item={this.props.item}>
          <div key="menu">
            <Button color="primary" text="left" to="checkCreateRequest" block flat query={{target: {id: this.props.item.get('id'), type: this.props.item.get('type'), name: this.props.item.get('name')}}}>
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