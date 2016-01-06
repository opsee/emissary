import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

const CheckScreenshot = React.createClass({

  propTypes: {

  },

  render() {
    return (
      <div>just hanging out</div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(null, mapDispatchToProps)(CheckScreenshot);
