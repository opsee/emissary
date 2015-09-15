import React, {PropTypes} from 'react';
import {Button} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: The Bastion Instance"/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <p>Here are some frequently asked questions and answers about the Opsee Bastion Instance:</p>

              <h2>What is the Opsee Bastion Instance?</h2>
              <p>The Bastion Instance is an EC2 instance running Opsee software. It receives instructions from your Opsee app and runs the health checks you prescribe.</p>

              <h2>What type of instance is the Bastion? How much does it cost to run?</h2>
              <p>The Bastion instance is a <a target="_blank" href="https://aws.amazon.com/ec2/instance-types/">t2.micro instance</a> and it is completely <strong>FREE</strong> to run. In the future we plan to offer larger sizes with greater processing capability, but we'll keep you posted when that happens.</p>

              <h2>How does the Bastion Instance discover what's running in my AWS Environment?</h2>
              <p>The Bastion Instance only uses readily available AWS APIs to discover your Instances, Groups, Services, and other AWS data.</p>

              <h2>What kind of access and permissions does the Bastion Instance have to my environment?</h2>
              <p>You can see a complete overview of the Bastion Instance permissions in our <a href="/docs/cloudformation">Cloudformation template document</a>.</p>

              <h2>Does Opsee install any software on my systems?</h2>
              <p>No. Opsee does not install any software on your systems.</p>

              <h2>Can I add more than one Bastion Instance?</h2>
              <p>You're only able to have 1 Bastion Instance in your environment right now. We're working on ways to add more Bastion Instances across multiple regions, VPCs, and subnets, and we'll keep you posted. If you're interested in this capability now, drop us a line at <a href="mailto:support@opsee.co">support@opsee.co</a>.</p>

              <h2>What language is the Bastion Instance written in? Can I check out the source code?</h2>
              <p>The Bastion Instance is written in Go. If your company requires a source code review or if you simply want to do diligence on us, drop us a line at <a href="mailto:support@opsee.co">support@opsee.co</a>.</p>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
