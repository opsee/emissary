import React, {PropTypes} from 'react';
import {Authenticator, Toolbar} from '../global';

export default React.createClass({
  propTypes: {
    children: PropTypes.node
  },
  render() {
    return (
       <Authenticator>
         <Toolbar title="How Opsee Works"/>
         {this.props.children}
      </Authenticator>
    );
  }
});