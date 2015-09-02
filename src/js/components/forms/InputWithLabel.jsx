import React from 'react';
import Label from './Label.jsx';

export default React.createClass({
  render(){
    return(
      <div>
        <Label bf={this.props.bf}/>
        {this.props.bf.render()}
      </div>
    )
  }
});