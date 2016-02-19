import React, {PropTypes} from 'react';
import {Toolbar} from '../global';

export default React.createClass({
  propTypes: {
    children: PropTypes.node
  },
  render() {
    return (
       <div>
         <Toolbar title="How Opsee Works"/>
         {this.props.children}
      </div>
    );
  }
});