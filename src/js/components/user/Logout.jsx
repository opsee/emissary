import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Toolbar} from '../global';

import {
  user as actions
} from '../../actions';

const Logout = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      logout: PropTypes.func
    })
  },
  componentWillMount(){
    this.props.actions.logout();
  },
  render() {
    return (
      <div>
        <Toolbar title="Logout"/>
        Loging out...
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(Logout);