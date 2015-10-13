import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {ChevronRight} from '../icons';
import {StepCounter} from '../global';
import img from '../../../img/tut-checks.svg';
import {Grid, Row, Col} from '../../modules/bootstrap';

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
        <Col>
          <img className="step-image" src={img}/>
          <h2>Create Health Checks, but Don&rsquo;t Maintain Them</h2>
          <p>In Opsee you can create health checks for security groups, ELBs, and soon other entities like EC2 Tags, Regions, or Availability Zones. Opsee applies these checks to the right instances for you, and knows when new instances come online.</p>
          <div className="clearfix"><br/></div>
          <div className="clearfix">
            <Link to="onboardRegionSelect" className="btn btn-success btn-raised btn-block">
              Start Installation&nbsp;<ChevronRight inline={true}/>
            </Link>
          </div>
          <StepCounter active={3} steps={3}/>
        </Col>
      </Row>
    </Grid>
    );
  }
});
