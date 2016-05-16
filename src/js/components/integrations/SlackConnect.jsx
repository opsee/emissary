import React, {PropTypes} from 'react';

const SlackConnect = React.createClass({
  propTypes: {
    redirect: PropTypes.string,
    target: PropTypes.string
  },
  getDefaultProps() {
    return {
      target: '_blank'
    };
  },
  render() {
    const redirect = this.props.redirect || `${window.location.origin}/profile?slack=true`;
    return (
      <a href={`https://slack.com/oauth/authorize?scope=commands,bot,team:read&client_id=3378465181.4743809532&redirect_uri=${redirect}`} target={this.props.target}>
        Connect to Slack
      </a>
    );
  }
});

export default SlackConnect;