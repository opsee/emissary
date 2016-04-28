import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {PagerdutyConnect} from '../integrations';
import {storage} from '../../modules';
import {Mail, Slack, PagerDuty} from '../icons';
import {Alert, Padding} from '../layout';
import {
  integrations as integrationsActions
} from '../../actions';

const NotificationItemList = React.createClass({
  propTypes: {
    notifications: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired
    })).isRequired,
    integrationsActions: PropTypes.shape({
      getSlackChannels: PropTypes.func,
      getPagerdutyInfo: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        integrationsSlackChannels: PropTypes.object
      }),
      integrations: PropTypes.shape({
        slackChannels: PropTypes.object
      })
    })
  },
  componentWillMount(){
    this.props.integrationsActions.getPagerdutyInfo();
    if (!this.props.redux.asyncActions.integrationsSlackChannels.history.length){
      this.props.integrationsActions.getSlackChannels();
    }

    window.addEventListener('storage', event => {
      if (typeof event === 'object' && event.key === 'shouldSyncPagerduty') {
        this.props.integrationsActions.getPagerdutyInfo();
      }
      storage.remove(event.key);
    });
  },
  getSlackChannelFromId(id){
    const channels = this.props.redux.integrations.slackChannels.toJS();
    return channels.find(c => c.id === id);
  },
  renderItem(n, i){
    switch (n.type){
    case 'email':
      return (
        <Padding key={`notif-${i}`} b={1}>
          <Mail inline/> {n.value}
        </Padding>
      );
    case 'slack_bot':
      const channel = this.getSlackChannelFromId(n.value);
      if (channel){
        return (
          <Padding key={`notif-${i}`} b={1}>
            <Slack inline/> {_.get(channel, 'name')}
          </Padding>
        );
      }
      return null;
    case 'pagerduty':
      const isPagerDutyDisabled = !_.get(this.props.redux, 'integrations.pagerdutyInfo.enabled');
      return (
        <Padding key={`notif-${i}`} b={1}>
          <div>
            <PagerDuty fill="white" style={{height: '1.3em', verticalAlign: 'bottom', opacity: isPagerDutyDisabled ? 0.5 : 1}} />
            {this.props.redux.asyncActions.integrationsPagerdutyInfo.history.length && isPagerDutyDisabled ?
              <Padding t={1}>
                <Alert color="warning">You are no longer connected to PagerDuty! <PagerdutyConnect /> to re-enable this notification.</Alert>
              </Padding>
            : null}
          </div>
        </Padding>
      );
    default:
      return null;
    }
  },
  render() {
    console.log(this.props.redux.asyncActions);
    const notifications = this.props.notifications;
    if (notifications.length){
      return (
        <div>
          {notifications.map((n, i) => {
            return this.renderItem(n, i);
          })}
        </div>
      );
    }
    return (
      <Alert color="warning">This check does not have any notifications. You will not be alerted if this check fails.</Alert>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  integrationsActions: bindActionCreators(integrationsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationItemList);