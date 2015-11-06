import React, {PropTypes} from 'react';
import Label from './Label.jsx';
import {Dropdown} from '../../modules/bootstrap';
import _ from 'lodash';
import Button from './Button';
import {ChevronDown, ChevronUp} from '../icons';
import style from './dropdown.css';

export default React.createClass({
  propTypes: {
    bf: PropTypes.object.isRequired
  },
  getInitialState(){
    return this.getState();
  },
  componentDidMount(){
    const val = this.props.bf.value();
    if (val){
      const obj = {};
      obj[this.state.bf.name] = val;
      this.state.bf.form.updateData(obj);
    }
  },
  componentWillReceiveProps(){
    this.setState(this.getState());
  },
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
  getLabelFromChoice(key){
    let bf = this.state && this.state.bf || this.props.bf;
    let choice = _.find(bf.field._choices, c => c[0] === key);
    if (choice && Array.isArray(choice)){
      choice = choice[1];
    }
    return choice;
  },
  onSelect(choice){
    const obj = {};
    obj[this.state.bf.name] = choice[0];
    this.state.bf.form.updateData(obj);
    this.setState({
      label: choice[1]
    });
  },
  handleClick(){
    this.setState({open: !this.state.open});
  },
  renderChevron(){
    if (this.state.open){
      return (
        <ChevronUp style={{position: 'absolute', right: '10px', top: '10px'}}/>
      );
    }
    return (
      <ChevronDown style={{position: 'absolute', right: '10px', top: '10px'}}/>
    );
  },
  renderMenu(){
    if (this.state.open){
      return (
        <div className={style.menu}>
          {
            this.props.bf.field._choices.map((choice, i) => {
              return (
                <Button block color="dark" dropdown key={`${this.props.bf.idForLabel}-menu-item-${i}`} onClick={this.onSelect.bind(null, choice)}>
                {choice[1]}
                </Button>
              );
            })
          }
        </div>
      );
    }
    return <div/>;
  },
  render(){
    return (
      <Dropdown id={this.props.bf.idForLabel()}>
          <Label bf={this.props.bf}/>
          <div style={{position: 'relative'}}>
            <Button id={this.props.bf.idForLabel()} color="dark" dropdown className="flex-order-2" onClick={this.handleClick} block>
              {this.state.label}
              {this.renderChevron()}
            </Button>
            {this.renderMenu()}
        </div>
      </Dropdown>
    );
  }
});