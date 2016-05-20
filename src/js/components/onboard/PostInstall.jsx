import React from 'react';

import Checkmark from '../svgs/Checkmark';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import style from './onboard.css';

export default React.createClass({
  render(){
    return (
      <div className={style.transitionPanel}>
        <Grid>
          <Row>
            <Padding a={2} style={{margin: '0 auto'}}>
              <Checkmark />
            </Padding>
          </Row>

          <Row>
            <Col xs={12} className="text-center">
              <h2>You're all done!</h2>
              <p>The Opsee instance was successfully installed.</p>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Padding t={3} b={2} className="text-center">
                <h2>420</h2>
                <h3 style={{fontWeight: 300}}>health checks</h3>
                <div style={{opacity: 0.5}}><small>were created for you!</small></div>
              </Padding>
            </Col>
          </Row>


          <Row>
            <Col xs={12}>
              <Padding t={4} b={1} className="text-center">
                <h4 className={style.successHeader}>What Opsee found</h4>
                <div className={style.successDivider} />
              </Padding>
            </Col>
          </Row>

          <Row>
            <Col xs={4}>
              <Padding a={1} className="text-center">
                <h3 style={{opacity: 0.85}}>120</h3>
                <div style={{opacity: 0.5}}><small>EC2 instances</small></div>
              </Padding>
            </Col>
            <Col xs={4}>
              <Padding a={1} className="text-center">
                <h3 style={{opacity: 0.85}}>89</h3>
                <div style={{opacity: 0.5}}><small>security groups</small></div>
              </Padding>
            </Col>
            <Col xs={4}>
              <Padding a={1} className="text-center">
                <h3 style={{opacity: 0.85}}>10</h3>
                <div style={{opacity: 0.5}}><small>load balancers</small></div>
              </Padding>
            </Col>
          </Row>


          <Row>
            <Col xs={12}>
              <Padding t={4} b={2}>
                <Button to="/" color="primary" block>Hooray!</Button>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});