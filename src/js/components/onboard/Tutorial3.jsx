import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {ChevronRight} from '../icons';
import {StepCounter} from '../global';
import img from '../../../img/tut-checks.svg';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';

export default React.createClass({
  statics:{
    willTransitionTo(transition, params, query, cb){
      const newImg = new Image();
      newImg.src = img;
      newImg.onload = () => cb();
    }
  },
  render() {
    return (
     <Grid>
      <Row>
        <Col xs={12}>
          <img className="step-image" src={img}/>
          <h2>Create Health Checks, but Don&rsquo;t Maintain Them</h2>
          <p>In Opsee you can create health checks for security groups, ELBs, and soon other entities like EC2 Tags, Regions, or Availability Zones. Opsee applies these checks to the right instances for you, and knows when new instances come online.</p>
          <Padding t={2}>
            <Button to="onboardRegionSelect" color="success" block={true} chevron={true}>Start Installation</Button>
          </Padding>
          <StepCounter active={3} steps={3}/>
        </Col>
      </Row>
    </Grid>
    );
  }
});
