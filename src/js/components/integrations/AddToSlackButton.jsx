import React from 'react';

import {Button} from '../forms';

const AddToSlackButton = React.createClass({
  render() {
    const redirect = `${window.location.origin}/integrations/slack`;
    return (
      <a href={`https://slack.com/oauth/authorize?scope=incoming-webhook,commands,bot&client_id=3378465181.4743809532&redirect_uri=${redirect}`} target="_blank">
        <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"/>
      </a>
    );
  }
});

export default AddToSlackButton;