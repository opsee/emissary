import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {List, is} from 'immutable';

import InstanceItem from './InstanceItem.jsx';
import {Alert} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {Link} from 'react-router';
import {SetInterval} from '../../modules/mixins';
import {StatusHandler} from '../global';
import {env as actions} from '../../actions';

const InstanceItemList = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    instances: PropTypes.instanceOf(List),
    groupSecurity: PropTypes.string,
    offset: PropTypes.number,
    limit: PropTypes.number,
    ids: PropTypes.array,
    title: PropTypes.bool,
    noFallback: PropTypes.bool,
    type: PropTypes.string,
    filter: PropTypes.bool,
    interval: PropTypes.number,
    //disable fetch data on component mount?
    noFetch: PropTypes.bool,
    actions: PropTypes.shape({
      getInstancesEcc: PropTypes.func,
      getInstancesRds: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      search: PropTypes.shape({
        string: PropTypes.string
      }),
      env: PropTypes.shape({
        instances: PropTypes.shape({
          ecc: PropTypes.object
        }),
        filtered: PropTypes.shape({
          instances: PropTypes.shape({
            ecc: PropTypes.object,
            rds: PropTypes.object
          })
        })
      })
    }).isRequired
  },
  componentWillMount(){
    this.setInterval(this.getData, this.props.interval);
    if (this.props.noFetch && this.props.redux.asyncActions[this.getAction()].history.length){
      return true;
    }
    this.getData();
  },
  shouldComponentUpdate(nextProps) {
    let arr = [];
    const {props} = this;
    const {redux} = props;
    const action = this.getAction();
    arr.push(!is(nextProps.redux.env.instances[props.type], redux.env.instances[props.type]));
    arr.push(nextProps.redux.search.string !== redux.search.string);
    arr.push(nextProps.redux.asyncActions[action].status !== redux.asyncActions[action].status);
    return _.some(arr);
  },
  getDefaultProps() {
    return {
      type: 'ecc',
      offset: 0,
      limit: 1000,
      interval: 30000
    };
  },
  getInitialState(){
    return {
      offset: this.props.offset || 0,
      limit: this.props.limit || 8
    };
  },
  getData(){
    if (!this.props.instances){
      if (this.props.type === 'rds'){
        return this.props.actions.getInstancesRds();
      }
      return this.props.actions.getInstancesEcc();
    }
  },
  getInstances(noFilter){
    const {type} = this.props;
    const translated = (type === 'EC2' ? 'ECC' : type).toLowerCase();
    let data = this.props.instances ? this.props.instances : this.props.redux.env.instances[translated];
    if (noFilter){
      return data;
    }
    if (this.props.filter){
      data = this.props.redux.env.filtered.instances[translated];
    }
    if (this.props.ids){
      data = data.filter(d => {
        return this.props.ids.indexOf(d.id) > -1;
      });
    }
    if (this.props.groupSecurity){
      data = data.filter(d => {
        if (type === 'rds'){
          return _.chain(d.toJS()).get('VpcSecurityGroups').pluck('VpcSecurityGroupId').indexOf(this.props.groupSecurity).value() > -1;
        }
        return _.chain(d.toJS()).get('SecurityGroups').pluck('GroupId').indexOf(this.props.groupSecurity).value() > -1;
      });
    }
    data = data.sortBy(item => {
      return typeof item.get('health') === 'number' ? item.get('health') : 101;
    });
    return data.slice(this.props.offset, this.props.limit);
  },
  getEnvLink(){
    let string = '/env-instances-ec2';
    if (this.props.type === 'rds'){
      string = '/env-instances-rds';
    }
    return string;
  },
  getAction(){
    return `getInstances${_.capitalize(this.props.type)}`;
  },
  getStatus(){
    return this.props.redux.asyncActions[this.getAction()];
  },
  getTitle(){
    let title = this.props.type || '';
    switch (this.props.type){
    case 'rds':
      title = 'RDS DB';
      break;
    case 'ecc':
      title = 'EC2';
      break;
    default:
      break;
    }
    return title;
  },
  renderLink(){
    if (this.getInstances(true).size && this.props.limit < this.getInstances(true).size){
      return (
        <Padding t={1}>
          <Link to={this.getEnvLink()}>
            Show {this.getInstances(true).size - this.props.limit} more
          </Link>
        </Padding>
      );
    }
    return null;
  },
  renderTitle(){
    let numbers = `(${this.getInstances(true).size})`;
    if (this.getInstances().size < this.getInstances(true).size){
      numbers = `(${this.getInstances().size} of ${this.getInstances(true).size})`;
    }
    if (!this.getInstances().size){
      numbers = '';
    }
    if (this.props.title && (!this.props.noFallback || (this.props.noFallback && this.getInstances().size))){
      return <h3>{this.getTitle()} Instances {numbers}</h3>;
    }
    return null;
  },
  renderNoMatch(){
    if (!this.getInstances().size && !this.props.noFallback){
      return <Alert bsStyle="default">No {this.getTitle()} instances found</Alert>;
    }
    return null;
  },
  render(){
    if (this.getInstances().size){
      return (
        <div>
          {this.renderTitle()}
          {this.getInstances().map(instance => {
            return <InstanceItem item={instance} key={instance.get('id')} {...this.props} noMenu={instance.type !== 'EC2'}/>;
          })}
          {this.renderNoMatch()}
          {this.renderLink()}
        </div>
      );
    }
    return (
      <div>
        {this.renderTitle()}
        <StatusHandler status={this.getStatus().status} history={this.getStatus().history} noFallback={this.props.noFallback}>
          <Alert bsStyle="default">No {this.getTitle()} instances found</Alert>
        </StatusHandler>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(InstanceItemList);