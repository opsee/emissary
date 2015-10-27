import React, {PropTypes} from 'react';
React.initializeTouchEvents(true);
import Button from './Button.jsx';
import {Add, Checkmark} from '../icons';

export default React.createClass({
  propTypes: {
    on: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label: PropTypes.string.isRequired
  },
  getStyle(){
    return this.props.on ? 'success' : 'default';
  },
  getIcon(){
    return this.props.on ? <Checkmark inline/> : <Add inline/>;
  },
  render(){
    return (
      <Button color={this.getStyle()} onClick={this.props.onChange.bind(null, this.props.id, !this.props.on)} style={{textTransform: 'none'}}>{this.getIcon()} {this.props.label}</Button>
    );
  }
});