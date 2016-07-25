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
// import {MetricGraph} from '../global';
import StateGraph from './StateGraph';

const ViewHTTP = React.createClass({
  propTypes: {
    check: PropTypes.object,
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        responsesFormatted: PropTypes.array
      })
    })
  },
  getResponses(){
    return new List(this.props.redux.checks.responsesFormatted);
  },
  getRTTData(){
    return _.map(this.props.check.metrics || [], m => {
      return _.assign(m, {
        name: 'request_latency'
      });
    });
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
  renderRTT(){
    return null;
    // const assertion = this.getRTTAssertion();
    // const data = this.getRTTData();
    // if (data && data.length){
    //   return (
    //     <Padding b={2}>
    //       <Heading level={3}>Round-Trip Time</Heading>
    //       <MetricGraph metric={{units: 'ms'}} assertion={assertion} data={data} showTooltip={false} aspectRatio={0.3} threshold={!!assertion}/>
    //     </Padding>
    //   );
    // }
    // return null;
  },
  render(){
    const check = this.props.check.toJS();
    const spec = check.spec || {};
    const target = check.target || {};
    let d = _.chain(check.results).head().get('time').value() || new Date();
    if (typeof d === 'number'){
      d = new Date(d * 1000);
    }
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
        {this.renderRTT()}

        {this.renderNotifications()}
      </div>
    );
  }
});

export default ViewHTTP;