import React from 'react';
import Label from './Label.jsx';

export default React.createClass({
  renderLabel(){
    if(this.props.bf.field.widgetAttrs.noLabel){
      return <span/>
    }else{
      <Label className="flex-order-1" bf={this.props.bf} />
    }
  },
  render(){
    var classString = 'flex-column';
    if (this.props.children) {
      classString += ' has-icon';
    }
    return (
      <div className={classString}>
        <div className="input-container flex-order-2">{this.props.bf.render()}</div>
        {this.renderLabel()}
        {this.props.children}
      </div>
    )
  }
});