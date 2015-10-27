import React from 'react';
import {Toolbar} from '../global';
import GroupItem from '../groups/GroupItem.jsx';
import TimeAgo from 'react-timeago';
import InstanceItem from '../instances/InstanceItem.jsx';
import {InstanceStore} from '../../stores';
import {InstanceActions} from '../../actions';
import {SetInterval} from '../../modules/mixins';
import Immutable from 'immutable';
import variables from '../../module/variables';
const slack = variables.integrations.slack;

function getState(){
  return {
    instance: InstanceStore.getInstance()
  };
}

export default React.createClass({
  mixins: [InstanceStore.mixin, SetInterval],
  storeDidChange() {
    this.setState(getState());
  },
  getInitialState(){
    return getState();
  },
  render() {
    return (
    <Button color="primary" href={`${slack.endpoints.auth}?client_id=${slack.creds.client_id}&state=${Date.now()}&redirect_uri=${window.location.origin}`}>
      Connect to Slack
    </Button>
    );
  }
});