import React from 'react';
// import {Link} from 'react-router';
import {Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: Checks and Check Targets"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <h3>Check Types</h3>

              <h3>Check Targets</h3>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});