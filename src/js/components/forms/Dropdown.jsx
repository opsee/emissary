import React from 'react';
import Label from './Label.jsx';
import {DropdownButton, MenuItem, Dropdown} from '../../modules/bootstrap';
import _ from 'lodash';
import Button from './Button';
import {ChevronDown, ChevronUp} from '../icons';
import style from './dropdown.css';

export default React.createClass({
  getState(){
    let label = this.props.bf.value();
    if (label){
      label = this.getLabelFromChoice(label);
    }else {
      label = _.clone(this.props.bf.label);
    }
    return _.extend({}, this.props, {
      label: label,
      open: false
    });
  },
  getInitialState(){
    return this.getState();
  },
  getLabelFromChoice(key){
    let bf = this.state && this.state.bf || this.props.bf;
    let choice = _.find(bf.field._choices, choice => choice[0] == key);
    if (choice && Array.isArray(choice)){
      choice = choice[1];
    }
    return choice;
  },
  onSelect(e, choice){
    e.preventDefault();
    const obj = {};
    obj[this.state.bf.name] = choice[0];
    this.state.bf.form.updateData(obj);
    this.setState({
      label: choice[1]
    })
  },
  componentDidMount(){
    const val = this.props.bf.value();
    if (val){
      const obj = {};
      obj[this.state.bf.name] = val;
      this.state.bf.form.updateData(obj);
    }
  },
  componentWillReceiveProps(nextProps){
    this.setState(this.getState());
  },
  toggleOpen(){
    this.setState({open:!this.state.open});
  },
  renderChevron(){
    if (this.state.open){
      return (
        <ChevronUp style={{position: 'absolute', right: '10px', top: '10px'}}/>
      )
    }else {
      return (
        <ChevronDown style={{position: 'absolute', right: '10px', top: '10px'}}/>
      )
    }
  },
  renderMenu(){
    if (this.state.open){
      return (
        <div className={style.menu}>
          {
            this.props.bf.field._choices.map((choice, i) => {
              return (
                <Button block={true} dropdown={true} key={`${this.props.bf.idForLabel}-menu-item-${i}`} onClick={this.onSelect.bind(null, event, choice)}>
                {choice[1]}
                </Button>
              )
            })
          }
        </div>
      )
    }else {
      return <div/>
    }
  },
  render(){
    return (
      <Dropdown id={this.props.bf.idForLabel()}>
          <Label bf={this.props.bf}/>
          <div style={{position: 'relative'}}>
            <Button id={this.props.bf.idForLabel()} dropdown={true} className="flex-order-2" onClick={this.toggleOpen} block={true}>
              {this.state.label}
              {this.renderChevron()}
            </Button>
            {this.renderMenu()}
        </div>
      </Dropdown>
    )
  }
});