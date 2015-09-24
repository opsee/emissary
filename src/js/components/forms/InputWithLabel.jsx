import React from 'react';
import Label from './Label.jsx';

export default React.createClass({
  render(){
    return(
      <div>
        <Label bf={this.props.bf}>
          {this.props.children}
        </Label>
        <div className="display-flex flex-vertical-align">
          {
          // <label htmlFor={this.props.bf.idForLabel()}>
          //   {this.props.children}
          // </label>
          }
          <div className="flex-1">
            {this.props.bf.render()}
          </div>
        </div>
      </div>
    )
  }
});