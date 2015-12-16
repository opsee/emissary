import React, {PropTypes} from 'react';
import _ from 'lodash';
import {Map} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {ListItem} from '../global';
import {Add, ListCheckmark, ListClose, ListInstance} from '../icons';
import {Button} from '../forms';
import {env as actions} from '../../reduxactions';

const GroupItem = React.createClass({
  propTypes: {
    item: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    target: PropTypes.object,
    groups: PropTypes.shape({
      security: PropTypes.object,
      elb: PropTypes.object,
      rds: PropTypes.object
    }),
    actions: PropTypes.shape({
      getGroupsElb: PropTypes.func,
      getGroupsSecurity: PropTypes.func
    })
  },
  getDefaultProps(){
    return {
      item: new Map()
    };
  },
  componentWillMount(){
    if (_.get(this.props, 'target.type')){
      switch (this.props.target.type){
      case 'elb':
        this.props.actions.getGroupsElb();
        break;
      default:
        this.props.actions.getGroupsSecurity();
        break;
      }
    }
  },
  getItem(){
    if (_.get(this.props, 'target.type')){
      switch (this.props.target.type){
      case 'elb':
        const elb = this.props.groups.elb.find(group => {
          return group.get('id') === this.props.target.id;
        });
        return elb || new Map();
      default:
        const sg = this.props.groups.security.find(group => {
          return group.get('id') === this.props.target.id;
        });
        return sg || new Map();
      }
    }
    return this.props.item;
  },
  getLink(){
    const type = this.getItem().get('type').toLowerCase();
    return `/group/${type}/${this.getItem().get('id')}`;
  },
  getInfoText(){
    if (this.getItem().get('total')){
      return  (
        <span>
          <span>
            <ListCheckmark inline fill="textSecondary"/>
            {this.getItem().get('passing')}
            &nbsp;&nbsp;
            <ListClose inline fill="textSecondary"/>
            {this.getItem().get('total') - this.getItem().get('passing')}
            &nbsp;&nbsp;
            <ListInstance inline fill="textSecondary"/>
            {this.getItem().get('instance_count')}
          </span>
        </span>
      );
    }else if (this.getItem().get('checks').size){
      return 'Initializing checks';
    }
    return  (
      <span>
        <ListCheckmark inline fill="textSecondary"/>No checks
        &nbsp;
        <ListInstance inline fill="textSecondary"/>{this.getItem().get('instance_count')}
      </span>
    );
  },
  render(){
    if (this.getItem().get('name')){
      return (
        <ListItem type="Group" link={this.getLink()} params={{id: this.getItem().get('id'), name: this.getItem().get('name')}} onClick={this.props.onClick} state={this.getItem().state} item={this.getItem()} title={`${this.getItem().get('name')} - ${this.getItem().get('instance_count')} instances`} menuTitle={`${this.getItem().get('name')} Actions`}>
          <div key="menu">
            <Button color="primary" text="left" to={`/check-create/request?id=${this.getItem().get('id')}&type=${this.getItem().get('type')}&name=${this.getItem().get('name')}`} block flat>
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

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

const mapStateToProps = (state) => ({
  groups: state.env.groups
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupItem);