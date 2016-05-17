import React from 'react';

import Checkmark from '../svgs/Checkmark';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import {plain as seed} from 'seedling';
import style from './onboard.css';

export default React.createClass({
  render(){
    return (
      <div>
        <Grid fluid>
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
              <Padding b={1} className="text-center">
                <h4 className={style.successHeader}>What Opsee found</h4>
                <div className={style.successDivider} />
              </Padding>
            </Col>
          </Row>

          <Row>
            <Col xs={4}>
              <div className="text-center">
                <h3 style={{opacity: 0.85}}>120</h3>
                <div style={{opacity: 0.5}}><small>EC2 instances</small></div>
              </div>
            </Col>
            <Col xs={4}>
              <div className="text-center">
                <h3 style={{opacity: 0.85}}>89</h3>
                <div style={{opacity: 0.5}}><small>security groups</small></div>
              </div>
            </Col>
            <Col xs={4}>
              <div className="text-center">
                <h3 style={{opacity: 0.85}}>10</h3>
                <div style={{opacity: 0.5}}><small>load balancers</small></div>
              </div>
            </Col>
          </Row>
        </Grid>

        <Row>
          <Col xs={12}>
            <Padding t={3} b={1} className="text-center">
              <h4 className={style.successHeader}>What Opsee created</h4>
              <div className={style.successDivider} />
            </Padding>
          </Col>
        </Row>

          <Row>
            <Col xs={2}/>
            <Col xs={4}>
              <Padding b={2} className="text-center">
                <h2>420</h2>
                <h3 style={{fontWeight: 300}}>health checks</h3>
                <div style={{opacity: 0.5}}><small>were created</small></div>
              </Padding>
            </Col>
            <Col xs={4}>
              <Padding b={2} className="text-center">
                <h2>95%</h2>
                <h3 style={{fontWeight: 300}}>coverage</h3>
                <div style={{opacity: 0.5}}><small>generated</small></div>
              </Padding>
            </Col>
            <Col xs={2}/>
          </Row>


        <Padding t={4} b={2} className="text-center">

        </Padding>

        <p>From here, you can either configure your default notification channels or check out the checks that Opsee generated for you.</p>

        {/* TODO: don't show this if they've already set up notifs */}
        <Padding tb={1}>
          <Button to="/start/notifications" color="primary" block>Set up notifications</Button>
        </Padding>
        <Padding b={1}>
          <Button to="/" color="primary" flat block chevron>View checks</Button>
        </Padding>
      </div>
    );
  }
});