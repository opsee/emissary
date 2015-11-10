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
              <p>Thanks for letting us know you're interested in Opsee! We're currently reviewing signups for our private beta, and if you're a good fit you'll get an email from us.</p>
              <p>Til then, check out the <a href="http://twitter.com/opseeco" target="_blank">@opseeco on Twitter</a> for updates.</p>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
