import React, {PropTypes} from 'react';
import _ from 'lodash';
import slate from 'slate';
import {Close, Checkmark} from '../icons';
import style from './assertionCounter.css';
import {ScreenReaderOnly} from '../type';

const AssertionCounter = React.createClass({
  propTypes: {
    response: PropTypes.object,
    item: PropTypes.shape({
      key: PropTypes.string.isRequired,
      operand: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      relationship: PropTypes.string.isRequired
    }),
    passing: PropTypes.bool,
    title: PropTypes.string
  },
  getDefaultProps() {
    return {
      passing: undefined
    };
  },
  getTitle(passing){
    if (this.props.title){
      return this.props.title;
    }
    return passing ? 'Assertion is currently passing.' : 'Assertion is currently failing.';
  },
  getClass(passing){
    if (this.props.response || this.props.passing !== undefined){
      return passing ? style.counterSuccess : style.counterDanger;
    }
    return style.counterWaiting;
  },
  getResponse(){
    if (this.props.response && this.props.response.toJS){
      return _.get(this.props.response.toJS(), 'response');
    }
    return this.props.response;
  },
  runTest(){
    if (this.props.passing){
      return {};
    }
    let response = _.assign({}, this.getResponse()) || {};
    //cast to string because that's what slate wants
    response.body = typeof response.body === 'object' ? JSON.stringify(response.body) : response.body;
    return slate.checkAssertion(this.props.item, response);
  },
  renderIcon(passing){
    return passing ? (
      <Checkmark btn fill="#303030" style={{top: '0.3rem'}}/>
    ) : (
      <Close btn fill="#303030" style={{top: '0.3rem'}}/>
    );
  },
  render(){
    const result = this.runTest();
    const passing = this.props.passing !== undefined ? this.props.passing : !!(result && result.success);
    return (
      <div title={this.getTitle(passing)} className={this.getClass(passing)}>
        {this.renderIcon(passing)}
        <ScreenReaderOnly>{result.error}</ScreenReaderOnly>
    </div>
    );
  }
});

export default AssertionCounter;