import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Mail, Slack} from '../icons';
import pagerDutyLogo from '../../../img/logos/pagerduty.svg';
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
      getSlackChannels: PropTypes.func
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
    if (!this.props.redux.asyncActions.integrationsSlackChannels.history.length){
      this.props.integrationsActions.getSlackChannels();
    }
  },
  getSlackChannelFromId(id){
    const channels = this.props.redux.integrations.slackChannels.toJS();
    return channels.find(c => c.id === id);
  },
  renderItem(n, i){
    if (n.type === 'email'){
      return (
        <Padding key={`notif-${i}`} b={1}>
          <Mail inline/> {n.value}
        </Padding>
      );
    } else if (n.type === 'slack_bot'){
      const channel = this.getSlackChannelFromId(n.value);
      if (channel){
        return (
          <Padding key={`notif-${i}`} b={1}>
            <Slack inline/> {channel.name}
          </Padding>
        );
      }
    } else if (n.type === 'pagerduty'){
      return (
        <Padding key={`notif-${i}`} b={1}>
          <img src={pagerDutyLogo} style={{height: '1.3em', verticalAlign: 'bottom'}} />
        </Padding>
      );
    }
    return null;
  },
  render() {
    if (this.props.notifications.length){
      return (
        <div>
          {this.props.notifications.map((n, i) => {
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