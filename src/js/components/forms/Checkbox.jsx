import React, {PropTypes} from 'react';
import cx from 'classnames';
import _ from 'lodash';
import {plain as seed} from 'seedling';

import style from './checkbox.css';
import {Button} from '../forms';
import {Checkmark} from '../icons';

const Radio = React.createClass({
  propTypes: {
    selected: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    color: PropTypes.string,
    id: PropTypes.string
  },
  getDefaultProps() {
    return {
      selected: false,
      onChange: _.noop,
      color: 'default'
    };
  },
  getInitialState() {
    return {
      id: this.props.id || `checkmark-${_.uniqueId()}`
    };
  },
  getClass(){
    return cx(
      style.selector, 
      this.props.selected && style.selectorSelected, 
      style[this.props.color]
    );
  },
  handleClick() {
    this.props.onChange(!this.props.selected);
  },
  render(){
    return (
      <Button icon flat secondary onClick={this.handleClick} title="Select" className={this.getClass()}>
        {this.props.selected ? <Checkmark btn fill={seed.color.gray9}/> : null}
        <input id={this.state.id} className="sr-only" onChange={this.handleClick}/>
      </Button>
    );
  }
});

export default Radio;