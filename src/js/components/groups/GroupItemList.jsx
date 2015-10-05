import React from 'react';
import Immutable, {List} from 'immutable';
import GroupItem from './GroupItem.jsx';

export default React.createClass({
  propTypes:{
    groups:React.PropTypes.instanceOf(List).isRequired
  },
  getGroups(){
    return this.props.groups;
  },
  isSelected(id){
    return this.props.selected && this.props.selected == id;
  },
  isNotSelected(id){
    return this.props.selected && this.props.selected != id;
  },
  render() {
    const self = this;
    if(this.props.groups.size){
      return(
        <div>
          {this.getGroups().map((group, i) => {
            return <GroupItem item={group} tabIndex={i} {...self.props} selected={self.isSelected(group.get('id'))} notSelected={self.isNotSelected(group.get('id'))}/>
          })}
        </div>
      )
    }else{
      return(
        <div>
          No Groups available.
        </div>
      )
    }
  }
});