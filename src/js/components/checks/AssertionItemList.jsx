import React, {PropTypes} from 'react';
import AssertionItem from './AssertionItem.jsx';
import {Alert} from '../../modules/bootstrap';
import {Padding} from '../layout';

export default React.createClass({
  propTypes: {
    assertions: PropTypes.array.isRequired,
    response: PropTypes.object
  },
  render() {
    if (this.props.assertions.length){
      return (
        <div>
          {this.props.assertions.map((assertion, i) => {
            return (
              <Padding tb={0.5} key={`assertion-item-${i}`}>
                <AssertionItem item={assertion} key={i} response={this.props.response}/>
              </Padding>
              );
          })}
        </div>
      );
    }
    return (
      <Alert bsStyle="default">
        No assertions
      </Alert>
    );
  }
});