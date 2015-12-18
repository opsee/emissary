import React, {PropTypes} from 'react';
import Immutable, {Record} from 'immutable';

import {ListItem} from '../global';
import {Close, ListCheckmark} from '../icons';
import InstanceMenu from './InstanceMenu';

const InstanceItem = React.createClass({
  propTypes: {
    item: PropTypes.instanceOf(Record).isRequired,
    onClick: PropTypes.func
  },
  shouldComponentUpdate(nextProps) {
    return !Immutable.is(this.props.item, nextProps.item);
  },
  getLink(){
    const type = this.props.item.get('type').toLowerCase();
    return `/instance/${type}/${this.props.item.get('id')}`;
  },
  renderInfoText(){
    if (this.props.item.get('total')){
      const passing = this.props.item.get('passing');
      const failing = this.props.item.get('total') - passing;
      return (
        <span>
          <span title={`${passing} check${passing === 1 ? '' : 's'} passing`}>
            <ListCheckmark inline fill="textSecondary"/>{passing}
          </span>
          &nbsp;&nbsp;
          <span title={`${failing} check${failing === 1 ? '' : 's'} failing`}>
            <Close inline fill="textSecondary"/>{failing}
          </span>
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
        <ListItem type="Group" link={this.getLink()} params={{id: this.props.item.get('id'), name: this.props.item.get('name')}} onClick={this.props.onClick} state={this.props.item.state} item={this.props.item} onClose={this.runResetPageState} noMenu>
          <InstanceMenu item={this.props.item} key="menu"/>
          <div key="line1">{this.props.item.get('name')}</div>
          <div key="line2">{this.renderInfoText()}</div>
        </ListItem>
      );
    }
    return <div/>;
  }
});

export default InstanceItem;