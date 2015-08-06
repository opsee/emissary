import React from 'react';
import BaseSVG from './BaseSVG.jsx';
import Radium from 'radium';

const Icon = React.createClass({
  render: function() {
    return (
      <BaseSVG path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" {...this.props}/>
    )
  }
});

export default Radium(Icon);