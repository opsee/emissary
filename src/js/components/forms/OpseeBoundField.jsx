import React from 'react';

import OpseeInputWithLabel from './OpseeInputWithLabel.jsx';
import OpseeDropdown from './OpseeDropdown.jsx';
import OpseeMultiToggle from './OpseeMultiToggle.jsx';

export default React.createClass({
  output(){
    switch(this.props.bf.field.constructor.name){
      case 'ChoiceField':
      return(
        <div className="form-group">
          <OpseeDropdown bf={this.props.bf}/>
        </div>
      );
      break;
      case 'MultipleChoiceField':
        return (
          <OpseeMultiToggle bf={this.props.bf}/>
        );
      break;
      default:
      return(
        <div className="form-group">
          <OpseeInputWithLabel bf={this.props.bf}/>
        </div>
      );
      break;
    }
  },
  render(){
    return (
      <div>
        {this.output()}
      </div>
    )
  }
});