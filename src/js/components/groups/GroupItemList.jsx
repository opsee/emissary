import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {List, is} from 'immutable';

import GroupItem from './GroupItem.jsx';
import {Alert, Padding} from '../layout';
import {SetInterval} from '../../modules/mixins';
import {Link} from 'react-router';
import {StatusHandler} from '../global';
import {Heading} from '../type';
import {env as actions} from '../../actions';

const GroupItemList = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    groups: PropTypes.instanceOf(List),
    offset: PropTypes.number,
    limit: PropTypes.number,
    ids: PropTypes.array,
    type: PropTypes.string,
    title: PropTypes.string,
    instanceIds: PropTypes.array,
    //display nothing if no groups found
    noFallback: PropTypes.bool,
    //use search results?
    filter: PropTypes.bool,
    //data fetching frequency (ms)
    interval: PropTypes.number,
    //disable fetch data on component mount?
    noFetch: PropTypes.bool,
    actions: PropTypes.shape({
      getGroupsElb: PropTypes.func,
      getGroupsSecurity: PropTypes.func,
      getGroupsAsg: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.object,
      env: PropTypes.shape({
        groups: PropTypes.shape({
          security: PropTypes.object,
          elb: PropTypes.object
        }),
        filtered: PropTypes.shape({
          groups: PropTypes.shape({
            security: PropTypes.object,
            elb: PropTypes.object
          })
        })
      })
    }).isRequired
  },
  getDefaultProps(){
    return {
      type: 'security',
      offset: 0,
      limit: 1000,
      interval: 30000
    };
  },
  componentWillMount(){
    this.setInterval(this.getData, this.props.interval);
    if (this.props.noFetch && this.props.redux.asyncActions[this.getAction()].history.length){
      return true;
    }
    return this.getData();
  },
  shouldComponentUpdate(nextProps) {
    let arr = [];
    const {props} = this;
    const {redux} = props;
    const nextRedux = nextProps.redux;
    const action = this.getAction();
    arr.push(!is(nextRedux.env.groups[props.type], redux.env.groups[props.type]));
    arr.push(!is(nextRedux.env.filtered.groups[props.type], redux.env.filtered.groups[props.type]));
    arr.push(nextRedux.asyncActions[action].status !== redux.asyncActions[action].status);
    arr.push(nextProps.limit !== props.limit);
    return _.some(arr);
  },
  getData(){
    const fn = this.props.actions[this.getAction()];
    if (typeof fn === 'function'){
      fn.call();
    }
  },
  getGroups(noFilter){
    let data = this.props.groups || this.props.redux.env.groups[this.props.type];
    data = data.sortBy(item => {
      return typeof item.get('health') === 'number' ? item.get('health') : 101;
    });
    if (noFilter){
      return data;
    }
    if (this.props.filter){
      data = this.props.redux.env.filtered.groups[this.props.type];
    }
    if (this.props.ids){
      data = data.filter(d => {
        return this.props.ids.indexOf(d.id) > -1;
      });
    }
    if (this.props.instanceIds){
      data = data.filter(d => {
        return _.intersection(this.props.instanceIds, d.get('Instances').toJS().map(i => i.InstanceId)).length;
      });
    }
    return data.slice(this.props.offset, this.props.limit);
  },
  getEnvLink(){
    let string = '/env-groups-security';
    if (this.props.type === 'elb'){
      string = '/env-groups-elb';
    }
    return string;
  },
  getAction(){
    return `getGroups${_.capitalize(this.props.type)}`;
  },
  getStatus(){
    return this.props.redux.asyncActions[this.getAction()];
  },
  renderLink(){
    if (this.getGroups(true).size && this.props.limit < this.getGroups(true).size){
      return (
        <Padding t={1} key="groupitemlist-link">
          <Link to={this.getEnvLink()}>
            Show {this.getGroups(true).size - this.props.limit} more
          </Link>
        </Padding>
      );
    }
    return null;
  },
  renderTitle(){
    let numbers = `(${this.getGroups(true).size})`;
    if (this.getGroups().size < this.getGroups(true).size){
      if (!this.props.ids && !this.props.instanceIds){
        numbers = `(${this.getGroups().size} of ${this.getGroups(true).size})`;
      } else {
        numbers = `(${this.getGroups().size})`;
      }
    }
    if (!this.getGroups().size){
      numbers = '';
    }
    if (this.props.title && (!this.props.noFallback || (this.props.noFallback && this.getGroups().size))){
      return <Heading level={3}>{this.props.title} {numbers}</Heading>;
    }
    return null;
  },
  renderNoMatch(){
    if (!this.getGroups().size && !this.props.noFallback){
      return <Alert color="default">No groups found</Alert>;
    }
    return null;
  },
  render() {
    if (this.getGroups(true).size){
      return (
        <div>
          {this.renderTitle()}
          {this.getGroups().map((group, i) => {
            return <GroupItem item={group} tabIndex={i} {...this.props} key={group.get('id')}/>;
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
          <Alert color="default">No groups found</Alert>
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupItemList);