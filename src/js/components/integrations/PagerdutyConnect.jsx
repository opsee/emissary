import React, {PropTypes} from 'react';

const PagerdutyConnect = React.createClass({
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
    const redirect = this.props.redirect || `${window.location.origin}/profile?pagerduty=true`;
    return (
      <a href={`https://connect.pagerduty.com/connect?vendor=d145e60c88fa059d5336&callback=${redirect}`} target={this.props.target}>
        Connect to PagerDuty
      </a>
    );
  }
});

export default PagerdutyConnect;