import React, {PropTypes} from 'react';
import {Record} from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {ListItem} from '../global';
import {Edit, Delete, Checkmark, Close} from '../icons';
import {Button} from '../forms';
import {CheckActions} from '../../actions';

const CheckItem = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    item: PropTypes.instanceOf(Record).isRequired,
    onClick: PropTypes.func
  },
  getInfoText(){
    if (this.props.item.get('total')){
      return (
        <span>
          <Checkmark inline fill="textSecondary"/>{this.props.item.get('passing')}
          &nbsp;
          <Close inline fill="textSecondary"/>{this.props.item.get('total') - this.props.item.get('passing')}
        </span>
      );
    }
    return 'Initializing';
  },
  handleDeleteClick(e){
    e.preventDefault();
    CheckActions.deleteCheck(this.props.item.get('id'));
    this.setState({showModal: false});
  },
  render(){
    if (this.props.item.get('name')){
      return (
        <ListItem type="Check" link="check" params={{id: this.props.item.get('id'), name: this.props.item.get('name')}} onClick={this.props.onClick} item={this.props.item}>
          <div key="menu">
            <Button text="left" color="primary" block flat to="checkEdit"  params={{id: this.props.item.get('id')}}>
              <Edit inline fill="primary"/> Edit
            </Button>
            <Button text="left" color="danger" block flat onClick={this.handleDeleteClick}>
              <Delete inline fill="danger"/> Delete
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

export default CheckItem;