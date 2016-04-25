import React, {PropTypes} from 'react';
import _ from 'lodash';
import {List, Map} from 'immutable';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {BastionRequirement, Toolbar, StatusHandler} from '../global';
import {GroupItem} from '../groups';
import {InstanceItem} from '../instances';
import {Edit, Delete} from '../icons';
import {Button} from '../forms';
import {Col, Grid, Padding, Row} from '../layout';
import {Heading} from '../type';
import AssertionItemList from './AssertionItemList';
import CheckResponsePaginate from './CheckResponsePaginate';
import NotificationItemList from './NotificationItemList';
import HTTPRequestItem from './HTTPRequestItem';

const ViewCloudwatch = React.createClass({
  propTypes: {
    check: PropTypes.object
  },
  renderNotifications(){
    let notifs = this.props.check.get('notifications');
    notifs = notifs.toJS ? notifs.toJS() : notifs;
    if (this.props.check.get('COMPLETE')){
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
    const target = this.props.check.get('target');
    return (
      <Padding b={1}>
        <Heading level={3}>Target</Heading>
        <InstanceItem target={target}/>
      </Padding>
    );
  },
  render(){
    const check = this.props.check.toJS();
    if (check.name){
      const spec = check.spec || {};
      const target = check.target || {};
      let d = _.chain(check.results).head().get('time').value() || new Date();
      if (typeof d === 'number'){
        d = new Date(d * 1000);
      }
      return (
        <div>
          {this.renderTarget()}
          <Padding b={1}>
            <Heading level={3}>Assertions</Heading>
            {check.COMPLETE && <AssertionItemList assertions={check.assertions}/>}
          </Padding>

          {this.renderNotifications()}
        </div>
      );
    }
    return (
      <StatusHandler status={this.props.redux.asyncActions.getCheck.status}/>
    );
  }
});

export default ViewCloudwatch;