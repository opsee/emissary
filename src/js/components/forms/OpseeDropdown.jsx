import React from 'react';
import OpseeLabel from '../forms/OpseeLabel.jsx';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import _ from 'lodash';

export default React.createClass({
  getInitialState(){
    return _.extend(this.props, {
      label:this.props.bf.label
    });
  },
  onSelect(key){
    const obj = {};
    obj[this.state.bf.name] = key;
    this.state.bf.form.updateData(obj);
    let choice = _.find(this.state.bf.field._choices, choice => choice[0] == key);
    if(choice){
      this.setState({
        label:choice[1]
      })
    }
  },
  render(){
    return(
      <DropdownButton title={this.state.label} key={this.props.bf.idForLabel()}>
      {
        this.props.bf.field._choices.map(choice => {
          return (
            <MenuItem eventKey={choice[0]} onSelect={this.onSelect}>{choice[1]}</MenuItem>
          )
        })
      }
      </DropdownButton>
    )
  }
});