import React, {PropTypes} from 'react';
import _ from 'lodash';
import Immutable, {Map} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {ListItem} from '../global';
import {ListCheckmark, ListClose, ListInstance} from '../icons';
import {env as actions} from '../../actions';

const GroupItem = React.createClass({
  propTypes: {
    item: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    target: PropTypes.object,
    groups: PropTypes.shape({
      security: PropTypes.object,
      elb: PropTypes.object,
      rds: PropTypes.object,
      asg: PropTypes.object,
      ecs: PropTypes.object
    }),
    actions: PropTypes.shape({
      getGroupsElb: PropTypes.func,
      getGroupsSecurity: PropTypes.func,
      getGroupsAsg: PropTypes.func,
      getGroupsEcs: PropTypes.func
    }),
    redux: PropTypes.shape({
      env: PropTypes.shape({
        instances: PropTypes.shape({
          ecc: PropTypes.object.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
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
        return this.props.actions.getGroupsElb();
      case 'asg':
        return this.props.actions.getGroupsAsg();
      case 'ecs':
        return this.props.actions.getGroupsEcs();
      default:
        return this.props.actions.getGroupsSecurity();
      }
    }
    return true;
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
  getSecurityInstances(){
    const item = this.getItem().toJS();
    return _.chain(this.props.redux.env.instances.ecc.toJS())
    .filter(instance => {
      return _.map(instance.SecurityGroups, 'GroupId').indexOf(item.id) > -1;
    })
    .map('id')
    .value() || [];
  },
  getItem(){
    if (_.get(this.props, 'target.type')){
      switch (this.props.target.type){
      case 'elb':
        const elb = this.props.groups.elb.find(group => {
          return group.get('id') === this.props.target.id;
        });
        return elb || new Map();
      case 'asg':
        const asg = this.props.groups.asg.find(group => {
          return group.get('id') === this.props.target.id;
        });
        return asg || new Map();
      case 'ecs':
        const ecs = this.props.groups.ecs.find(group => {
          return group.get('id') === this.props.target.id;
        });
        return ecs || new Map();
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
  getCreateCheckLink(){
    const target = _.pick(this.getItem().toJS(), ['id', 'type', 'name']);
    const data = JSON.stringify({target});
    return `/check-create/request?data=${data}`;
  },
  getType(){
    switch (this.getItem().get('type')){
    case 'elb':
      return 'ELB';
    case 'asg':
      return 'ASG';
    case 'ecs':
      return 'ECS';
    default:
      break;
    }
    return 'SG';
  },
  renderInstanceCount(item){
    if (item.Instances){
      const count = (item.Instances || []).length;
      return (
        <span title={`${count} instance${count === 1 ? '' : 's'} in this group`}>
          <ListInstance inline fill="textSecondary"/>
          {count}
        </span>
      );
    }
    return null;
  },
  renderInfoText(){
    const item = this.getItem().toJS();
    const {passing, total, failing} = item;
    if (total){
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
            {this.renderInstanceCount(item)}
          </span>
        </span>
      );
    } else if (item.checks.length){
      return 'Initializing checks';
    }
    return  (
      <span>
        <ListCheckmark inline fill="textSecondary"/>No checks
        &nbsp;
        {this.renderInstanceCount(item)}
      </span>
    );
  },
  render(){
    if (this.getItem().get('name')){
      return (
        <ListItem type="group" link={this.getLink()} params={{id: this.getItem().get('id'), name: this.getItem().get('name')}} onClick={this.props.onClick} item={this.getItem()} menuTitle={`${this.getItem().get('name')} Actions`}>
          <div key="line1">{this.getItem().get('name')}&nbsp;({this.getType()})</div>
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
  groups: state.env.groups,
  redux: state
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupItem);