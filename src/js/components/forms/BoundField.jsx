import React from 'react';

import MultiToggle from './MultiToggle.jsx';
import InputWithLabel from './InputWithLabel.jsx';
import DeleteFormButton from './DeleteFormButton.jsx';
import Dropdown from './Dropdown.jsx';
import RadioSelect from './RadioSelect.jsx';
import MultiButtonToggle from './MultiButtonToggle.jsx';
import InlineRadioSelect from './InlineRadioSelect.jsx';

export default React.createClass({
  fallback(){
    return(
    <div className="form-group">
      <InputWithLabel bf={this.props.bf}>
        {this.props.children}
      </InputWithLabel>
    </div>
    );
  },
  output(){
    switch(this.props.bf.field.constructor.name){
      case 'ChoiceField':
        let renderer;
        try{
          renderer = this.props.bf.field.widget.renderer().constructor.name;
        }catch(err){}
        if(renderer && renderer == 'RadioFieldRenderer'){
          if(this.props.bf.field.label == 'InlineRadioSelect'){
            return <InlineRadioSelect bf={this.props.bf}/>
          }else{
            return <RadioSelect bf={this.props.bf}/>
          }
        }else{
          return(
            <div className="form-group">
              <Dropdown bf={this.props.bf}/>
            </div>
          );
        }
      break;
      case 'BooleanField':
        if(this.props.bf.field.label == 'Delete'){
          return <DeleteFormButton bf={this.props.bf}/>
        }else{
          return this.fallback();
        }
      break;
      case 'MultipleChoiceField':
        if(this.props.bf.field.label == 'buttonToggle'){
          return <MultiButtonToggle bf={this.props.bf}/>
        }else{
          return <MultiToggle bf={this.props.bf}/>
        }
      break;
      case 'ChoiceField':
        return <RadioSelect bf={this.props.bf}/>
      break;
      default:
      return this.fallback();
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