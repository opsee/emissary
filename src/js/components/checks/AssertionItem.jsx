import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Row, Col} from '../layout';
import AssertionCounter from './AssertionCounter.jsx';
import relationships from 'slate/src/relationships';
import types from 'slate/src/types';

const AssertionItem = React.createClass({
  propTypes: {
    item: PropTypes.object.isRequired,
    response: PropTypes.object
  },
  getKey(){
    const key = this.props.item.key;
    return _.chain(types).find(t => {
      return t.id === key;
    }).get('name').value();
  },
  getValue(){
    const val = this.props.item.value;
    if (val === 'request_latency'){
      return 'Round-Trip Time';
    }
    return val;
  },
  getOperand(){
    let suffix = '';
    if (this.props.item.value === 'request_latency'){
      suffix = 'ms';
    }
    if (this.props.item.operand){
      return `${this.props.item.operand}${suffix}`;
    }
    return null;
  },
  getRelationship(){
    const rel = this.props.item.relationship;
    return _.chain(relationships).find(r => {
      return r.id === rel;
    }).get('name').value().toLowerCase();
  },
  render(){
    return (
      <Row className="flex-vertical-align">
        <Col xs={2} sm={1}>
          <AssertionCounter item={this.props.item} response={this.props.response}/>
        </Col>
        <Col xs={10} sm={11}>
        {this.getKey()}&nbsp;
        {this.props.item.value ? ` - ${this.getValue()} ` : null}
        <span className="text-secondary">{this.getRelationship()}&nbsp;</span>
        <strong>{this.getOperand()}</strong>
        </Col>
      </Row>
    );
  }
});

export default AssertionItem;
