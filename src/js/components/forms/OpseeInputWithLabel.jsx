import React from 'react';
import OpseeLabel from '../forms/OpseeLabel.jsx';

export default React.createClass({
  render(){
    return(
      <div>
        <OpseeLabel label={this.props.bf.label} id={this.props.bf.idForLabel()} bf={this.props.bf}/>
        {this.props.bf.render()}
    </div>
    )
  }
});