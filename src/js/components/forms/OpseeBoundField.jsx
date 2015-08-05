import React from 'react';

import OpseeInputWithLabel from './OpseeInputWithLabel.jsx';
import OpseeDropdown from './OpseeDropdown.jsx';

export default React.createClass({
  output(){
    switch(this.props.bf.field.constructor.name){
      case 'ChoiceField':
      return(
        <OpseeDropdown bf={this.props.bf}/>
      );
      break;
      default:
      return(
        <OpseeInputWithLabel bf={this.props.bf}/>
      );
      break;
    }
  },
  render(){
    return (
      <div>
        <div className="form-group">
          {this.output()}
        </div>
      </div>
    )
  }
});