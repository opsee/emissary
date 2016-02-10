import React, {PropTypes} from 'react';
import _ from 'lodash';
import Immutable, {Map} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {ContextMenu, ListItem} from '../global';
import {Add, ListCheckmark, ListClose, ListInstance} from '../icons';
import {Button} from '../forms';
import {env as actions} from '../../actions';

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
      item: new Map(),
      target: {}
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
  shouldComponentUpdate(nextProps) {
    const {props} = this;
    const {target} = props;
    let {type} = target;
    if (type === 'sg'){
      type = 'security';
    }
    let arr = [];
    arr.push(!_.isEqual(target, nextProps.target));
    if (target && type){
      arr.push(!Immutable.is(props.groups[type], nextProps.groups[type]));
    }
    arr.push(!Immutable.is(props.item, nextProps.item));
    return _.some(arr);
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
  renderInstanceCount(){
    const count = this.getItem().get('instance_count');
    return (
      <span title={`${count} instance${count === 1 ? '' : 's'} in this group`}>
        <ListInstance inline fill="textSecondary"/>
        {count}
      </span>
    );
  },
  renderInfoText(){
    if (this.getItem().get('total')){
      const passing = this.getItem().get('passing');
      const failing = this.getItem().get('total') - passing;
      return  (
        <span>
          <span>
            <span title={`${passing} check${passing === 1 ? '' : 's'} passing`}>
              <ListCheckmark inline fill="textSecondary"/>
              {passing}
            </span>
            &nbsp;&nbsp;
            <span title={`${failing} check${failing === 1 ? '' : 's'} failing`}>
              <ListClose inline fill="textSecondary"/>
              {failing}
            </span>
            &nbsp;&nbsp;
            {this.renderInstanceCount()}
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
        {this.renderInstanceCount()}
      </span>
    );
  },
  render(){
    if (this.getItem().get('name')){
      return (
        <ListItem type="group" link={this.getLink()} params={{id: this.getItem().get('id'), name: this.getItem().get('name')}} onClick={this.props.onClick} state={this.getItem().state} item={this.getItem()} menuTitle={`${this.getItem().get('name')} Actions`}>
          <ContextMenu title={`${this.getItem().get('name')} Actions`} id={this.getItem().get('id')} key="menu">
            <Button color="primary" text="left" to={`/check-create/request?id=${this.getItem().get('id')}&type=${this.getItem().get('type')}&name=${this.getItem().get('name')}`} block flat>
              <Add inline fill="primary"/> Create Check
            </Button>
          </ContextMenu>
          <div key="line1">{this.getItem().get('name')}</div>
          <div key="line2">{this.renderInfoText()}</div>
        </ListItem>
      );
    }
    return null;
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

const mapStateToProps = (state) => ({
  groups: state.env.groups
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupItem);