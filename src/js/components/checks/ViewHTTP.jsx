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

const ViewHTTP = React.createClass({
  propTypes: {
    check: PropTypes.object
  },
  getResponses(){
    return _.get(this.props.check.get('results').get(0), 'responses') || new List();
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
    if (target && target.type === 'host'){
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
          <Heading level={3}>HTTP Request</Heading>
          <HTTPRequestItem spec={spec} target={target} />
        </Padding>
        <Padding b={1}>
          <Heading level={3}>Assertions</Heading>
          {_.find(check.tags, () => 'complete') && <AssertionItemList assertions={check.assertions}/>}
        </Padding>
        <Padding b={2}>
          <CheckResponsePaginate responses={this.getResponses()} date={d}/>
        </Padding>

        {this.renderNotifications()}
      </div>
    );
  }
});

export default ViewHTTP;