import React, {PropTypes} from 'react';
import _ from 'lodash';
import slate from 'slate';
import {Close, Checkmark} from '../icons';
import colors from 'seedling/colors';
import style from './assertionCounter.css';

const AssertionCounter = React.createClass({
  propTypes: {
    key: PropTypes.string,
    relationship: PropTypes.string,
    operand: PropTypes.string,
    value: PropTypes.string,
    reponse: PropTypes.object
  },
  runTest(){
    return slate(_.assign(_.cloneDeep(this.props), {key: this.props.keyData}), this.props.response);
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
      <Checkmark className={style.iconSuccess}/>
    ) : (
      <Close className={style.iconDanger}/>
    )
  },
  render(){
    return (
      <div title={this.getTitle()} className={this.passing() ? style.counterSuccess : style.counterDanger}>
      {this.props.label}
      <div className={`${style.validation} ${!!this.props.relationship ? style.validationActive : ''}`}>
      {this.getSmallIcon()}
      <span className="sr-only">{this.runTest().error}</span>
      </div>
    </div>
    )
  }
});

export default AssertionCounter;