import React, {PropTypes} from 'react';
import _ from 'lodash';

import {StatusHandler} from '../global';
import {InstanceItem} from '../instances';
import {Padding} from '../layout';
import {Heading} from '../type';
import AssertionMetric from './AssertionMetric';
import NotificationItemList from './NotificationItemList';

const ViewCloudwatch = React.createClass({
  propTypes: {
    check: PropTypes.object,
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        getCheck: PropTypes.object
      }).isRequired
    }).isRequired
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
      let d = _.chain(check.results).head().get('time').value() || new Date();
      if (typeof d === 'number'){
        d = new Date(d * 1000);
      }
      return (
        <div>
          {this.renderTarget()}
          <Padding b={1}>
            <Heading level={3}>Assertions</Heading>
            {check.COMPLETE && check.assertions.map((assertion, i) => {
              return (
                <Padding b={1} key={`assertion-item-${i}`}>
                  <AssertionMetric check={check} assertion={assertion} index={i}/>
                </Padding>
              );
            })}
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