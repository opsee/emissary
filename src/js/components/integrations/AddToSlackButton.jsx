import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Button} from '../forms';
import {user as actions} from '../../actions';

const AddToSlackButton = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      edit: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        userEdit: PropTypes.object
      }),
      user: PropTypes.object
    })
  },
  handleClick(){
    console.log('click');
  },
  render() {
    return (
      <Button onClick={this.handleClick} to="https://slack.com/oauth/authorize?scope=incoming-webhook,commands,bot&client_id=3378465181.4743809532" target="_blank">Connect to Slack</Button>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(AddToSlackButton);