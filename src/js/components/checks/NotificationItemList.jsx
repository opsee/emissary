import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Mail, Slack} from '../icons';
import {Padding} from '../layout';
import {
  integrations as integrationsActions
} from '../../actions';

const NotificationItemList = React.createClass({
  propTypes: {
    notifications: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired
    })).isRequired,
    redux: PropTypes.shape({
      integrations: PropTypes.shape({
        slackChannels: PropTypes.object
      })
    })
  },
  getSlackChannelFromId(id){
    const channels = this.props.redux.integrations.slackChannels.toJS();
    return channels.find(c => c.id === id) || {};
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
      return (
        <Padding key={`notif-${i}`} b={1}>
          <Slack inline/> #{channel.name}
        </Padding>
      );
    }
  },
  render() {
    return (
      <div>
        {this.props.notifications.map((n, i) => {
          return this.renderItem(n, i);
        })}
      </div>
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