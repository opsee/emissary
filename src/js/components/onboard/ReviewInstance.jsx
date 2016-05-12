import React, {PropTypes} from 'react';
import {History} from 'react-router';

import {Heading} from '../type';
import {Button} from '../forms';
import {Expandable, Padding, Col, Grid, Row} from '../layout';
import style from './onboard.css';

export default React.createClass({
  render(){
    return (
      <div className={style.transitionPanel}>
        <Grid>
          <Row>
            <Col xs={12}>
              <h2>About the Opsee EC2 instance</h2>
              <p>Our EC2 instance is responsible for running checks in your AWS environment.</p>
              <p>The instance is controlled by both a CloudFormation template and an Ingress IAM Role,
              which are both available <a href="/docs/permissions" target="_blank">in our documentation</a>.
              You can manage it any time from your AWS console.</p>

              <Padding tb={1}>
                <Button block>More about the instance</Button>
              </Padding>
              <Padding tb={1}>
                <Button to="/start/launch-instance" color="success" block chevron>Got it</Button>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
})