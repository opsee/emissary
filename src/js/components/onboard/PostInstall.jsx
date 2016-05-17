import React from 'react';

import Checkmark from '../svgs/Checkmark';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';

export default React.createClass({
  render(){
    return (
      <div>
        <Padding b={4} className="text-center">
          <Checkmark />
          <h2>You're all done!</h2>
          <p>The Opsee instance was successfully installed. Here's what we found...</p>
        </Padding>

        <Grid fluid>
          <Row>
            <Col xs={4}>
              <div className="text-center">
                <h3>120</h3>
                <div style={{opacity: 0.5}}><small>EC2 instances</small></div>
              </div>
            </Col>
            <Col xs={4}>
              <div className="text-center">
                <h3>89</h3>
                <div style={{opacity: 0.5}}><small>security groups</small></div>
              </div>
            </Col>
            <Col xs={4}>
              <div className="text-center">
                <h3>10</h3>
                <div style={{opacity: 0.5}}><small>load balancers</small></div>
              </div>
            </Col>
          </Row>
        </Grid>

        <Padding tb={4} className="text-center">
          <h2>420</h2>
          <h3>health checks</h3>
          <p>were generated for you! Nice.</p>
        </Padding>
        <div>
          <Button to="/" color="success" block chevron>View checks</Button>
        </div>
      </div>
    );
  }
});