import React from 'react';
import Label from './Label.jsx';

export default React.createClass({
  render(){
    return(
      <div className="display-flex flex-column">
        <div className="flex-order-2">{this.props.bf.render()}</div>
        <Label className="flex-order-1" bf={this.props.bf}/>
      </div>
    )
  }
});