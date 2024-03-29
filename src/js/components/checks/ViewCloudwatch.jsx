import React, {PropTypes} from 'react';
import _ from 'lodash';

import {InstanceItem} from '../instances';
import {GroupItem} from '../groups';
import {Padding} from '../layout';
import {Heading} from '../type';
import AssertionMetric from './AssertionMetric';
import NotificationItemList from './NotificationItemList';
import StateGraph from './StateGraph';
import Feed from './Feed';

const ViewCloudwatch = React.createClass({
  propTypes: {
    check: PropTypes.object
  },
  renderNotifications(){
    let notifs = this.props.check.get('notifications');
    notifs = notifs.toJS ? notifs.toJS() : notifs;
    if (this.props.check.get('tags').find(() => 'complete')) {
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
    const target = this.props.check.toJS().target;
    let item = <InstanceItem target={target}/>;
    if ((target.type || '').match('security|asg|ecs|ecs_service')){
      item = <GroupItem target={target}/>;
    }
    return (
      <Padding b={1}>
        <Heading level={3}>Target</Heading>
        {item}
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
          <Padding b={2}>
            <StateGraph transitions={this.props.check.state_transitions} current={this.props.check.state}/>
            <Padding t={3}>
              <Feed id={check.id} renderAsInclude check={check}/>
            </Padding>
          </Padding>
          <Padding b={1}>
            <Heading level={3}>Assertions</Heading>
            {_.find(check.tags, () => 'complete') && check.assertions.map((assertion, i) => {
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
    return null;
  }
});

export default ViewCloudwatch;