import React from 'react';
import BaseSVG from './BaseSVG.jsx';
import Radium from 'radium';

const Icon = React.createClass({
  render: function() {
    return (
      <BaseSVG path="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" {...this.props}/>
    )
  }
});

export default Radium(Icon);