import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import SlackConnect from './SlackConnect';

const SlackInfo = React.createClass({
  propTypes: {
    user: PropTypes.object
  },
  render() {
    if (this.props.user.get('token')){
      return (
        <span>Connected to <a href="https://opsee.com">Opsee</a></span>
      );
    }
    return (
      <SlackConnect/>
    );
  }
});

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(SlackInfo);