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
  render() {
    if(this.props.groups.size){
      return(
        <div>
          {this.getGroups().map((group, i) => {
            return <GroupItem item={group} noLink={this.props.noLink} onClick={this.props.onClick} tabIndex={i}/>
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