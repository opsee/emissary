import React from 'react';
import BaseSVG from './BaseSVG.jsx';
import Radium from 'radium';

const Icon = React.createClass({
  render: function() {
    return (
      <BaseSVG path="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" {...this.props}/>
    )
  }
});

export default Radium(Icon);