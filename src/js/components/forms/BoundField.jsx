import React from 'react';

import MultiToggle from './MultiToggle.jsx';
import InputWithLabel from './InputWithLabel.jsx';
import Dropdown from './Dropdown.jsx';

export default React.createClass({
  output(){
    switch(this.props.bf.field.constructor.name){
      case 'ChoiceField':
      return(
        <div className="form-group">
          <Dropdown bf={this.props.bf}/>
        </div>
      );
      break;
      case 'MultipleChoiceField':
        return (
          <MultiToggle bf={this.props.bf}/>
        );
      break;
      default:
      return(
        <div className="form-group">
          <InputWithLabel bf={this.props.bf}/>
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