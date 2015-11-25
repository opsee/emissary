import React, {PropTypes} from 'react';
import AssertionItem from './AssertionItem.jsx';
// import {Alert} from '../../modules/bootstrap';
import {Padding} from '../layout';

const AssertionItemList = React.createClass({
  propTypes: {
    assertions: PropTypes.array,
    response: PropTypes.object
  },
  getDefaultProps(){
    return {
      assertions: []
    };
  },
  render() {
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
    // return (
    //   <Alert bsStyle="default">
    //     No assertions
    //   </Alert>
    // );
  }
});

export default AssertionItemList;