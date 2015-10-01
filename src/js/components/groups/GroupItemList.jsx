import React from 'react';
import {RadialGraph, ListItem} from '../global';
import {CheckActions} from '../../actions';
import Link from 'react-router/lib/components/Link'
import {MoreHoriz} from '../icons';
import colors from 'seedling/colors';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
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
        <ul className="list-unstyled">
          {this.getGroups().map(group => {
            return (
              <li key={group.get('id')}>
                <GroupItem item={group} noLink={this.props.noLink}/>
              </li>
              )
          })}
        </ul>
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