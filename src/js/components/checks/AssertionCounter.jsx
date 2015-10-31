import React, {PropTypes} from 'react';
import _ from 'lodash';
import slate from 'slate';
import {Close, Checkmark} from '../icons';
import colors from 'seedling/colors';
import style from './assertionCounter.css';

const AssertionCounter = React.createClass({
  propTypes:{
    key:PropTypes.string,
    relationship:PropTypes.string,
    operand:PropTypes.string,
    value:PropTypes.string,
    reponse:PropTypes.object
  },
  runTest(){
    return slate(_.assign(_.cloneDeep(this.props), {key:this.props.keyData}), this.props.response);
  },
  passing(){
    const test = this.runTest();
    return test && test.success;
  },
  isActive(){
    return !!this.props.relationship ? 'active' : '';
  },
  getTitle(){
    return this.passing() ? 'Assertion is currently passing.' : 'Assertion is currently failing.'
  },
  getSmallIcon(){
    return this.passing() ? (
      <Checkmark  btn={true} fill="#303030" />
    ) : (
      <Close btn={true} fill="#303030" />
    )
  },
  render(){
    return(
      <div title={this.getTitle()} className={this.passing() ? style.counterSuccess : style.counterDanger}>
        {this.getSmallIcon()}
      </div>
    )
  }
});

export default AssertionCounter;