import React from 'react';
// import {Link} from 'react-router';
import {Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: Check Types and Targets"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <h2>General Information</h2>

              <p>Checks run every 30 seconds. Opsee looks for 4 consecutive events of the same state - we call this "stable state". If a stable failing state occurs, you will receive a notifiction.</p>

              <p>Opsee currently supports the following check types and check targets:</p>
              <h2>Check Types</h2>

              <h3>HTTP</h3>
              <p>A HTTP request is made to your chosen target. The request must contain the following information:</p>
              <ul>
                <li>Method (GET, POST, PUT, DELETE, or PATCH</li>
                <li>Path (e.g. '/' or '/healthcheck')</li>
                <li>Port Number (e.g. 80)</li>
                <li>(optional) Header Key & Value (e.g. 'content-type' : 'application/json'</li>
              </ul>
              <p>Along with a request, at least one assertion must be defined against the Status Code, Headers, or Body of the response for a passing check.</p>

              <h2>Check Targets</h2>
              <p>The following entities can be used as targets for checks, with functionality as noted:</p>
              <h3>EC2 Instance</h3>
              <p>An EC2 Instance is a static target for a check, never altering its configuration.</p>

              <h3>EC2 Security Group</h3>
              <p>When a security group is set as a target, the check will run on all instances in the group. If instances are added and removed from the group, Opsee will automatically update the group definition, always running the check on the most up-to-date list of member instances</p>

              <h3>ELB (Elastic Load Balancer</h3>
              <p>When an ELB is set as a target, the check will run on all instances behind the load balancer. If instances are added and removed from the ELB definition, Opsee will automatically update the ELB definition, always running the check on the most up-to-date list of member instances</p>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});