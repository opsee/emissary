import React from 'react';
import Label from './Label.jsx';

export default React.createClass({
  render(){
    var classString = 'flex-column';
    if (this.props.children) {
      classString += ' has-icon';
    }
    if (this.props.bf.field.widgetAttrs.noLabel) {
      return (
        <div className={classString}>
          <div className="input-container flex-order-2">{this.props.bf.render()}</div>
          {this.props.children}
        </div>
      )
    } else {
      return (
        <div className={classString}>
          <div className="input-container flex-order-2">{this.props.bf.render()}</div>
            <Label className="flex-order-1" bf={this.props.bf} />
            {this.props.children}
        </div>
      )
    }
  }
});