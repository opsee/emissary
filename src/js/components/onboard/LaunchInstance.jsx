/* eslint-disable */
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
              <Padding tb={1}>
                <h2>Let's install the Opsee EC2 instance.</h2>
              </Padding>

              <p>Here's our best guess on where we should install it, based on your environment:</p>

              <Padding tb={2} className="text-center">
                <p>ap-southwest-1 > some-cool-vpc > some-cool-subnet</p>
                <p><small><a href="#">(Change)</a></small></p>
              </Padding>

              <Padding tb={1}>
                <Button to="/start/install-example" color="success" block chevron>Ready, set, launch!</Button>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
})