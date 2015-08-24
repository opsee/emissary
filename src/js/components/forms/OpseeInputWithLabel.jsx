import React from 'react';
import OpseeLabel from '../forms/OpseeLabel.jsx';

export default React.createClass({
  render(){
    return(
      <div>
        <OpseeLabel bf={this.props.bf}/>
        {this.props.bf.render()}
      </div>
    )
  }
});