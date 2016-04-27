import React, {PropTypes} from 'react';
import {Record, is} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {ListItem} from '../global';
import {ListClose, ListCheckmark} from '../icons';
import InstanceMenu from './InstanceMenu';
import {env as actions} from '../../actions';
import {InstanceEcc, InstanceRds} from '../../modules/schemas';

const InstanceItem = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getInstancesEcc: PropTypes.func,
      getInstancesRds: PropTypes.func
    }),
    instances: PropTypes.shape({
      ecc: PropTypes.object
    }),
    item: PropTypes.instanceOf(Record),
    target: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string
    }),
    noMenu: PropTypes.bool,
    onClick: PropTypes.func
  },
  componentWillMount(){
    const type = _.get(this.props, 'target.type');
    if (type) {
      if (type.match('dbinstance|rds')){
        return this.props.actions.getInstancesRds();
      }
      return this.props.actions.getInstancesEcc();
    }
    return true;
  },
  shouldComponentUpdate(nextProps) {
    if (this.props.target){
      return !is(this.props.instances, nextProps.instances);
    }
    return !is(this.props.item, nextProps.item);
  },
  getType(){
    let type = _.get(this.props, 'target.type');
    if (this.props.item){
      type = _.get(this.props.item.toJS(), 'type');
    }
    if (type.match('dbinstance')){
      type = 'rds';
    } else if (type === 'instance'){
      type = 'ecc';
    }
    return type;
  },
  getItem(){
    const type = this.getType();
    if (type){
      const schema = type === 'ecc' ? InstanceEcc : InstanceRds;
      return this.props.instances[type].find(i => {
        let id = _.get(this.props, 'target.id');
        if (this.props.item){
          id = _.get(this.props.item.toJS(), 'id');
        }
        return i.get('id') === id;
      }) || new schema();
    }
    return this.props.item;
  },
  getLink(){
    const type = this.getType().toLowerCase();
    return `/instance/${type}/${this.getItem().get('id')}`;
  },
  renderInfoText(){
    const item = this.getItem().toJS();
    const {passing, failing, total} = item;
    if (total){
      return (
        <span>
          <span title={`${passing} check${passing === 1 ? '' : 's'} passing`}>
            <ListCheckmark inline fill="textSecondary"/>{passing}
          </span>
          &nbsp;&nbsp;
          <span title={`${failing} check${failing === 1 ? '' : 's'} failing`}>
            <ListClose inline fill="textSecondary"/>{failing}
          </span>
        </span>
      );
    } else if (this.getItem().get('checks').size){
      return 'Initializing checks';
    }
    return (
      <span>
        <ListCheckmark inline fill="textSecondary"/>No checks
      </span>
    );
  },
  renderMenu(){
    if (!this.props.noMenu){
      return <InstanceMenu item={this.getItem()} key="menu"/>;
    }
    return null;
  },
  render(){
    if (this.getItem().get('name')){
      let type = this.getType().toUpperCase();
      type = type === 'ECC' ? 'EC2' : type;
      return (
        <ListItem type="instance" link={this.getLink()} params={{id: this.getItem().get('id'), name: this.getItem().get('name')}} onClick={this.props.onClick} item={this.getItem()} onClose={this.runResetPageState}>
          {this.renderMenu()}
          <div key="line1">{this.getItem().get('name')}&nbsp;({type})</div>
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
  instances: state.env.instances
});

export default connect(mapStateToProps, mapDispatchToProps)(InstanceItem);