import React from 'react';

import MultiToggle from './MultiToggle.jsx';
import InputWithLabel from './InputWithLabel.jsx';
import Dropdown from './Dropdown.jsx';
import RadioSelect from './RadioSelect.jsx';

export default React.createClass({
  output(){
    switch(this.props.bf.field.constructor.name){
      case 'ChoiceField':
        let renderer;
        try{
          renderer = this.props.bf.field.widget.renderer().constructor.name;
        }catch(err){
          console.log(err);
        }
        if(renderer && renderer == 'RadioFieldRenderer'){
          return <RadioSelect bf={this.props.bf}/>
        }else{
          return(
            <div className="form-group">
              <Dropdown bf={this.props.bf}/>
            </div>
          );
        }
      break;
      case 'MultipleChoiceField':
        return <MultiToggle bf={this.props.bf}/>
      break;
      case 'ChoiceField':
        return <RadioSelect bf={this.props.bf}/>
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