import React, {PropTypes} from 'react';
import _ from 'lodash';
React.initializeTouchEvents(true);
import Button from './Button.jsx';
import {Add, Box, Checkmark} from '../icons';
import colors from 'seedling/colors';

export default React.createClass({
  propTypes:{
    on:PropTypes.bool.isRequired,
    onChange:PropTypes.func.isRequired,
    id:PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label:PropTypes.string.isRequired
  },
  getStyle(){
    return this.props.on ? 'success' : 'default';
  },
  getIconStyle(){
    return {
      margin:'0 1px 0 -7px',
      position: 'relative',
      top: '2px',
      width:'17px',
      height:'17px'
    }
  },
  getIcon(){
    return this.props.on ? <Checkmark style={this.getIconStyle()} inline={true}/> : <Add style={this.getIconStyle()} inline={true}/>
  },
  render(){
    return (
      <Button bsStyle={this.getStyle()} onClick={this.props.onChange.bind(null, this.props.id, !this.props.on)} style={{textTransform:'none'}}>{this.getIcon()}{this.props.label}</Button>
    );
  }
});