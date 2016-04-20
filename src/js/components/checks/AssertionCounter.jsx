import React, {PropTypes} from 'react';
import _ from 'lodash';
import slate from 'slate';
import {Close, Checkmark} from '../icons';
import style from './assertionCounter.css';
import {ScreenReaderOnly} from '../type';

const AssertionCounter = React.createClass({
  propTypes: {
    response: PropTypes.object.isRequired,
    item: PropTypes.shape({
      key: PropTypes.string.isRequired,
      operand: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      relationship: PropTypes.string.isRequired
    }).isRequired
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
    let response = _.assign({}, this.getResponse()) || {};
    //cast to string because that's what slate wants
    response.body = typeof response.body === 'object' ? JSON.stringify(response.body) : response.body;
    return slate.checkAssertion(this.props.item, response);
  },
  renderIcon(){
    return this.isPassing() ? (
      <Checkmark btn fill="#303030" style={{top: '.5rem'}}/>
    ) : (
      <Close btn fill="#303030" style={{top: '.5rem'}}/>
    );
  },
  render(){
    return (
      <div title={this.getTitle()} className={this.getClass()}>
        {this.renderIcon()}
        <ScreenReaderOnly>{this.runTest().error}</ScreenReaderOnly>
    </div>
    );
  }
});

export default AssertionCounter;