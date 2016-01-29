import React, {PropTypes} from 'react';
import _ from 'lodash';
import slate from 'slate';
import {Close, Checkmark} from '../icons';
import style from './assertionCounter.css';

const AssertionCounter = React.createClass({
  propTypes: {
    key: PropTypes.string,
    relationship: PropTypes.string,
    operand: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    value: PropTypes.string,
    response: PropTypes.object,
    keyData: PropTypes.string
  },
  getTitle(){
    return this.isPassing() ? 'Assertion is currently passing.' : 'Assertion is currently failing.';
  },
  getClass(){
    if (this.props.response){
      return this.isPassing() ? style.counterSuccess : style.counterDanger;
    }
    return style.counterWaiting;
  },
  getResponse(){
    if (this.props.response && this.props.response.toJS){
      return _.get(this.props.response.toJS(), 'response.value');
    }
    return this.props.response;
  },
  isPassing(){
    const test = this.runTest();
    return test && test.success;
  },
  runTest(){
    return slate.checkAssertion(_.assign({}, this.props, {key: this.props.keyData}), this.getResponse());
  },
  renderIcon(){
    return this.isPassing() ? (
      <Checkmark btn fill="#303030"/>
    ) : (
      <Close btn fill="#303030"/>
    );
  },
  render(){
    return (
      <div title={this.getTitle()} className={this.getClass()}>
        {this.renderIcon()}
      <span className="sr-only">{this.runTest().error}</span>
    </div>
    );
  }
});

export default AssertionCounter;
