import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Grid, Row, Col} from '../../modules/bootstrap';
import AssertionCounter from './AssertionCounter.jsx';
import relationships from 'slate/src/relationships';
import types from 'slate/src/types';

const AssertionItem = React.createClass({
  propTypes: {
    item: PropTypes.object.isRequired,
    response: PropTypes.object.isRequired
  },
  getKey(){
    const key = this.props.item.key;
    return _.chain(types).find(t => {
      return t.id === key;
    }).get('name').value();
  },
  getRelationship(){
    const rel = this.props.item.relationship;
    return _.chain(relationships).find(r => {
      return r.id === rel;
    }).get('name').value().toLowerCase();
  },
  render(){
    return (
      <Grid fluid>
        <Row className="flex-vertical-align">
          <Col xs={2} sm={1}>
            <AssertionCounter label={1} {...this.props.item} keyData={this.props.item.key} response={this.props.response}/>
          </Col>
          <Col xs={10} sm={11}>
          <span>{this.getKey()}&nbsp;</span>
          <span className="text-secondary">{this.getRelationship()}&nbsp;</span>
          <strong>{this.props.item.operand}</strong>
          </Col>
        </Row>
      </Grid>
    );
  }
});

export default AssertionItem;