import React, {PropTypes} from 'react';
import _ from 'lodash';
import {List} from 'immutable';

import {GroupItem} from '../groups';
import {InstanceItem} from '../instances';
import {Padding} from '../layout';
import {Heading} from '../type';
import AssertionItemList from './AssertionItemList';
import CheckResponsePaginate from './CheckResponsePaginate';
import NotificationItemList from './NotificationItemList';
import HTTPRequestItem from './HTTPRequestItem';
import StateGraph from './StateGraph';
import {MetricGraph} from '../global';
import {flag, regions} from '../../modules';
import {Button} from '../forms';

const ViewHTTP = React.createClass({
  propTypes: {
    check: PropTypes.object,
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        responsesFormatted: PropTypes.array
      })
    })
  },
  getInitialState() {
    return {
      rttRegion: 'us-west-2'
    };
  },
  getResponses(){
    return new List(this.props.redux.checks.responsesFormatted);
  },
  getRTTData(check){
    return _.chain(this.props.check.metrics || [])
    .filter(m => {
      if (_.get(check, 'target.type') === 'host'){
        return true;
      }
      return !!_.find(m.tags, t => t.value === this.state.rttRegion);
    })
    .map(m => {
      return _.assign(m, {
        name: 'request_latency'
      });
    })
    .value();
  },
  getRTTAssertion(){
    return _.chain(this.props.check.toJS())
    .get('assertions')
    .find({
      key: 'metric',
      value: 'request_latency'
    })
    .value() || undefined;
  },
  getRegions(check){
    return _.chain(regions)
    .filter(r => {
      if (_.get(check, 'target.type') === 'host'){
        return r.id === _.chain(check).get('metrics[0].tags').find({name: 'region'}).get('value').value();
      }
      return _.get(check, 'target.type') === 'host' ? true : !!r.external;
    })
    .reverse()
    .value();
  },
  handleRttClick(id){
    this.setState({
      rttRegion: id
    });
  },
  renderNotifications(){
    let notifs = this.props.check.get('notifications');
    notifs = notifs.toJS ? notifs.toJS() : notifs;
    if (_.find(this.props.check.toJS().tags, () => 'complete')){
      return (
        <Padding b={1}>
          <Heading level={3}>Notifications</Heading>
          <NotificationItemList notifications={notifs} />
        </Padding>
      );
    }
    return null;
  },
  renderTarget(){
    const target = _.get(this.props.check.toJS(), 'target') || {};
    if (target && (target.type === 'host' || target.type === 'external_host')){
      return null;
    }
    let el;
    switch (target.type){
    case 'instance':
      el = <InstanceItem target={target}/>;
      break;
    default:
      el = <GroupItem target={target}/>;
      break;
    }
    return (
      <Padding b={1}>
        <Heading level={3}>Target</Heading>
        {el}
      </Padding>
    );
  },
  renderHeading(){
    const targetType = _.get(this.props.check.toJS(), 'target.type');
    let text = 'HTTP Request';
    if (targetType === 'host') {
      text = 'Internal HTTP Request';
    } else if (targetType === 'external_host') {
      text = 'Global HTTP Request';
    }
    return (
      <Heading level={3}>{text}</Heading>
    );
  },
  renderRTT(check){
    if (flag('graph-rtt')){
      const assertion = this.getRTTAssertion();
      const data = this.getRTTData(check);
      return (
        <Padding b={2}>
          <Heading level={3}>Round-Trip Time (max) - Last 2 Hours</Heading>
          <Padding b={1} className="display-flex flex-wrap">
            {this.getRegions(check).map(r => {
              return (
                <Padding r={1} b={1} key={`region-${r.id}`}>
                  <Button color="primary" flat={r.id !== this.state.rttRegion && check.target.type !== 'host'} onClick={this.handleRttClick.bind(null, r.id)}>{r.name}</Button>
                </Padding>
              );
            })}
          </Padding>
          <MetricGraph metric={{units: 'ms'}} assertion={assertion} data={data} showTooltip={false} aspectRatio={0.3} threshold={!!assertion} status="success"/>
        </Padding>
      );
    }
    return null;
  },
  render(){
    const check = this.props.check.toJS();
    const spec = check.spec || {};
    const target = check.target || {};
    const d = _.chain(check.results).head().get('timestamp').thru(t => typeof t === 'number' ? new Date(t) : new Date()).value();
    return (
      <div>
        {this.renderTarget()}
        <Padding b={2}>
          {this.renderHeading()}
          <HTTPRequestItem spec={spec} target={target} />
        </Padding>
        <Padding b={2}>
          <StateGraph transitions={this.props.check.state_transitions} current={this.props.check.state}/>
        </Padding>
        <Padding b={1}>
          <Heading level={3}>Assertions</Heading>
          {_.find(check.tags, () => 'complete') && <AssertionItemList assertions={check.assertions}/>}
        </Padding>
        <Padding b={2}>
          <CheckResponsePaginate responses={this.getResponses()} date={d}/>
        </Padding>
        {this.renderRTT(check)}

        {this.renderNotifications()}
      </div>
    );
  }
});

export default ViewHTTP;