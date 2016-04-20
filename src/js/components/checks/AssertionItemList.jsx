import React, {PropTypes} from 'react';
import AssertionItem from './AssertionItem.jsx';
import {Padding} from '../layout';
import {connect} from 'react-redux';

const AssertionItemList = React.createClass({
  propTypes: {
    assertions: PropTypes.array,
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        responses: PropTypes.object.isRequired,
        selectedResponse: PropTypes.number
      })
    })
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
            <Padding b={1} key={`assertion-item-${i}`}>
              <AssertionItem item={assertion} key={i} response={this.props.redux.checks.responses.get(this.props.redux.checks.selectedResponse)}/>
            </Padding>
            );
        })}
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps)(AssertionItemList);