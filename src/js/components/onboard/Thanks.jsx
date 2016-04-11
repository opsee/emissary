import React from 'react';
import {Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Thanks for Signing Up!"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <p>Great! Check your email to continue creating your account.</p>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
