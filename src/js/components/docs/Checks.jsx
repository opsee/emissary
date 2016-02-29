import React from 'react';
// import {Link} from 'react-router';
import {Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Heading} from '../type';

const Checks = React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: Check Types and Targets"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <p>Checks determine the Health of your services. Checks have four main components - a target, a request, assertions, and notifications.</p>
              <p>Checks run every 30 seconds. Opsee looks for 4 consecutive events of the same state - we call this "stable state". You will receive a notification the state of your check changes.</p>

              <Heading level={2}>Targets</Heading>
              <p>The following entities are available health check targets:</p>
              <Heading level={3}>EC2 Instance</Heading>
              <p>A single EC2 Instance of any size.</p>

              <Heading level={3}>EC2 Security Group</Heading>
              <p>When a security group is selected, the check will run on all instances in the group. If instances are added and removed from the group, Opsee will automatically update the group definition, always running the check on the most up-to-date list of member instances</p>

              <Heading level={3}>Elastic Load Balancer (ELB)</Heading>
              <p>When an ELB is set as a target, the check will run on all instances behind the load balancer. If instances are added and removed from the ELB definition, Opsee will automatically update the ELB definition, always running the check on the most up-to-date list of member instances</p>

              <Heading level={3}>HTTP</Heading>
              <p>A HTTP request is made to your chosen target. The request must contain the following information:</p>
              <ul>
                <li>Method (GET, POST, PUT, DELETE, or PATCH</li>
                <li>Path (e.g. '/' or '/healthcheck')</li>
                <li>Port Number (e.g. 80)</li>
                <li>(optional) Header Key & Value (e.g. 'content-type' : 'application/json'</li>
              </ul>
              <p>Along with a request, at least one assertion must be defined against the Status Code, Headers, or Body of the response for a passing check.</p>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Checks;