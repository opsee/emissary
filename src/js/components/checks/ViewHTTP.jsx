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
import Feed from './Feed';
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
    }),
    sections: PropTypes.arrayOf(PropTypes.string),
    historical: PropTypes.bool
  },
  getDefaultProps() {
    return {
      sections: [
        'rtt',
        'notifications',
        'assertions',
        'activity'
      ],
      historical: false
    };
  },
  getInitialState() {
    return {
      rttRegion: 'us-west-2'
    };
  },
  getResponses(){
    return new List(this.props.redux.checks.responsesFormatted);
  },
  getRTTData(){
    return _.chain(this.props.check.metrics || [])
    .filter(m => !!_.find(m.tags, t => t.value === this.state.rttRegion))
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
  isSection(str){
    return _.includes(this.props.sections, str);
  },
  handleRttClick(id){
    this.setState({
      rttRegion: id
    });
  },
  renderNotifications(check){
    const notifs = check.notifications || [];
    if (_.find(check.tags, () => 'complete') && this.isSection('notifications')){
      return (
        <Padding b={1}>
          <Heading level={3}>Notifications{this.props.historical && <span>&nbsp;(historical)</span>}</Heading>
          <NotificationItemList notifications={notifs} />
        </Padding>
      );
    }
    return null;
  },
  renderTarget(check){
    const target = _.get(check, 'target') || {};
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
  renderHeading(check){
    const targetType = _.get(check, 'target.type');
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
  renderStateGraph(check){
    if (this.isSection('activity')){
      return (
        <Padding b={2}>
          <StateGraph transitions={this.props.check.state_transitions} current={this.props.check.state}/>
          <Padding t={3}>
            <Feed id={check.id} renderAsInclude check={check}/>
          </Padding>
        </Padding>
      );
    }
    return null;
  },
  renderRTT(check){
    if (flag('graph-rtt') && this.isSection('rtt')){
      const assertion = this.getRTTAssertion(check);
      const data = this.getRTTData(check);
      if (data && data.length){
        return (
          <Padding b={2}>
            <Heading level={3}>Round-Trip Time (max) - Last 2 Hours</Heading>
            <Padding b={1} className="display-flex flex-wrap">
              {_.chain(regions)
                .filter({external: true})
                .reverse()
                .map(r => {
                  return (
                    <Padding r={1} b={1}>
                      <Button color="primary" flat={r.id !== this.state.rttRegion} onClick={this.handleRttClick.bind(null, r.id)}>{r.name}</Button>
                    </Padding>
                  );
                })
                .value()
              }
            </Padding>
            <MetricGraph metric={{units: 'ms'}} assertion={assertion} data={data} showTooltip={false} aspectRatio={0.3} threshold={!!assertion}/>
          </Padding>
        );
      }
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
        {this.renderTarget(check)}
        <Padding b={2}>
          {this.renderHeading(check)}
          <HTTPRequestItem spec={spec} target={target} />
        </Padding>
        {this.renderStateGraph(check)}
        <Padding b={1}>
          <Heading level={3}>Assertions</Heading>
          {_.find(check.tags, () => 'complete') && <AssertionItemList assertions={check.assertions}/>}
        </Padding>
        <Padding b={2}>
          <CheckResponsePaginate responses={this.getResponses()} date={d}/>
        </Padding>
        {this.renderRTT(check)}
        {this.renderNotifications(check)}
      </div>
    );
  }
});

export default ViewHTTP;