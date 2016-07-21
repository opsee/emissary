import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Button} from '../forms';
import {Padding} from '../layout';
import {
  app as actions
} from '../../actions';

const SchemePicker = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      setScheme: PropTypes.func.isRequired
    }).isRequired
  },
  handleSchemeClick(scheme){
    this.props.actions.setScheme(scheme);
  },
  render(){
    return (
      <div>
        <Padding inline r={1}>
          <Button onClick={this.handleSchemeClick.bind(null, 'dark')} color="black">Dark</Button>
        </Padding>
        <Button onClick={this.handleSchemeClick.bind(null, 'light')} style={{color: '#333', border: '2px solid #666', background: 'rgba(200, 200, 200, 1)'}}>Light</Button>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(SchemePicker);