import React, {PropTypes} from 'react';
import Immutable, {List} from 'immutable';
import AssertionItem from './AssertionItem.jsx';
import {Alert} from '../../modules/bootstrap';
import {Button} from '../forms';
import {ChevronDown} from '../icons';
import {Padding} from '../layout';

export default React.createClass({
  propTypes:{
    assertions:PropTypes.array.isRequired
  },
  render() {
    const self = this;
    if(this.props.assertions.length){
      return(
        <div>
          {this.props.assertions.map((assertion, i) => {
            return (
              <Padding tb={.5}>
                <AssertionItem item={assertion} key={i} response={this.props.response}/>
              </Padding>
              )
          })}
        </div>
      )
    }else{
      return (
        <Alert bsStyle="default">
          No assertions
        </Alert>
      )
    }
  }
});