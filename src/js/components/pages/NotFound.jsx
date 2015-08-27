import React, {PropTypes} from 'react';
import Store from '../../stores/Home';
import Toolbar from '../global/Toolbar.jsx';
import UserInputs from '../user/UserInputs.jsx';
import {Grid, Row, Col} from 'react-bootstrap';

function getState(){
  return {
    instances: Store.getInstances(),
    groups: Store.getGroups()
  }
}
export default React.createClass({
  mixins: [Store.mixin],
  storeDidChange() {
    this.setState(getState());
  },
  getDefaultProps() {
    return getState();
  },
  render() {
    return (
      <div>
        <Toolbar title="404"/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              Whoa boy. Page not found.
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
