import React from 'react';
import {OpseeLabel} from '../forms';
import {DropdownButton, MenuItem} from '../../modules/bootstrap';
import _ from 'lodash';

export default React.createClass({
  getState(){
    let label = this.props.bf.value();
    if(label){
      label = this.getLabelFromChoice(label);
    }else{
      label = _.clone(this.props.bf.label);
    }
    return _.extend({}, this.props, {
      label:label
    });
  },
  getInitialState(){
    return this.getState();
  },
  getLabelFromChoice(key){
    let bf = this.state && this.state.bf || this.props.bf;
    let choice = _.find(bf.field._choices, choice => choice[0] == key);
    if(choice && Array.isArray(choice)){
      choice = choice[1];
    }
    return choice;
  },
  onSelect(event, key){
    const obj = {};
    obj[this.state.bf.name] = key;
    this.state.bf.form.updateData(obj);
    let label = this.getLabelFromChoice(key);
    if(label){
      this.setState({
        label:label
      })
    }
  },
  componentWillReceiveProps(nextProps){
    this.setState(this.getState());
  },
  render(){
    return (
      <DropdownButton title={this.state.label} key={this.props.bf.idForLabel()} id={this.props.bf.idForLabel()} onSelect={this.onSelect}>
      {
        this.props.bf.field._choices.map((choice, i) => {
          return (
            <MenuItem key={`${this.props.bf.idForLabel}-menu-item-${i}`} eventKey={choice[0]} style={{overflow:'hidden'}}>{choice[1]}</MenuItem>
          )
        })
      }
      </DropdownButton>
    )
  }
});