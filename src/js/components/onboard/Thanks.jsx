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
              <p>Thanks for letting us know you're interested in Opsee! When you're approved for the Opsee beta program, you'll get an email. Til then, check out the <a href="http://twitter.com/opseeco" target="_blank">Opsee Twitter account</a> for updates.</p>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
