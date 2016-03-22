import React, {PropTypes} from 'react';
import Immutable, {Record} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {ListItem} from '../global';
import {Close, ListCheckmark} from '../icons';
import InstanceMenu from './InstanceMenu';
import {env as actions} from '../../actions';
import {InstanceEcc} from '../../modules/schemas';

const InstanceItem = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getInstancesEcc: PropTypes.func
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
    if (_.get(this.props, 'target.type')){
      this.props.actions.getInstancesEcc();
    }
  },
  shouldComponentUpdate(nextProps) {
    if (this.props.target){
      return !Immutable.is(this.props.instances, nextProps.instances);
    }
    return !Immutable.is(this.props.item, nextProps.item);
  },
  getItem(){
    if (_.get(this.props, 'target.type')){
      return this.props.instances.ecc.find(i => {
        return i.get('id') === this.props.target.id;
      }) || new InstanceEcc();
    }
    return this.props.item;
  },
  getLink(){
    const type = this.getType().toLowerCase();
    return `/instance/${type}/${this.getItem().get('id')}`;
  },
  getType(){
    let type = 'ECC';
    switch (this.getItem().get('type')){
    case 'RDS':
    case 'rds':
      type = 'RDS';
      break;
    default:
      break;
    }
    return type;
  },
  renderInfoText(){
    if (this.getItem().get('total')){
      const passing = this.getItem().get('passing');
      const failing = this.getItem().get('total') - passing;
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
      return (
        <ListItem type="instance" link={this.getLink()} params={{id: this.getItem().get('id'), name: this.getItem().get('name')}} onClick={this.props.onClick} state={this.getItem().state} item={this.getItem()} onClose={this.runResetPageState}>
          {this.renderMenu()}
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
  instances: state.env.instances
});

export default connect(mapStateToProps, mapDispatchToProps)(InstanceItem);