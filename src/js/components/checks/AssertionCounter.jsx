import React, {PropTypes} from 'react';
import _ from 'lodash';
import slate from 'slate';
import {Close, Checkmark} from '../icons';
import style from './assertionCounter.css';

const AssertionCounter = React.createClass({
  propTypes: {
    key: PropTypes.string,
    relationship: PropTypes.string,
    operand: PropTypes.string,
    value: PropTypes.string,
    response: PropTypes.object,
    keyData: PropTypes.string,
    label: PropTypes.string
  },
  getTitle(){
    return this.isPassing() ? 'Assertion is currently passing.' : 'Assertion is currently failing.';
  },
  isPassing(){
    const test = this.runTest();
    return test && test.success;
  },
  runTest(){
    return slate(_.assign({}, _.cloneDeep(this.props), {key: this.props.keyData}), _.cloneDeep(this.props.response));
  },
  renderSmallIcon(){
    return this.isPassing() ? (
      <Checkmark className={style.iconSuccess}/>
    ) : (
      <Close className={style.iconDanger}/>
    );
  },
  render(){
    return (
      <div title={this.getTitle()} className={this.isPassing() ? style.counterSuccess : style.counterDanger}>
      {this.props.label}
      <div className={`${style.validation} ${!!this.props.relationship ? style.validationActive : ''}`}>
      {this.renderSmallIcon()}
      <span className="sr-only">{this.runTest().error}</span>
      </div>
    </div>
    );
  }
});

export default AssertionCounter;