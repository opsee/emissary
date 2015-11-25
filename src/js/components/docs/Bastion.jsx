import React from 'react';
import {Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';

const Bastion = React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: The Bastion Instance"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <p>Here are some frequently asked questions and answers about the Opsee Bastion Instance:</p>

                <h3>What is the Opsee Bastion Instance?</h3>
                <p>The Bastion Instance is an EC2 instance running Opsee software. It receives instructions from your Opsee app and runs the health checks you prescribe.</p>
                <hr/>

                <h3>What type of instance is the Bastion? How much does it cost to run?</h3>
                <p>The Bastion instance is a <a target="_blank" href="https://aws.amazon.com/ec2/instance-types/">t2.micro instance</a> and it is completely <strong>FREE</strong> to run. In the future we plan to offer larger sizes with greater processing capability, but we will keep you posted when that happens.</p>
                <hr/>

                <h3>How does the Bastion Instance discover what is running in my AWS Environment?</h3>
                <p>The Bastion Instance only uses readily available AWS APIs to discover your Instances, Groups, Services, and other AWS data.</p>
                <hr/>

                <h3>Are there any constraints on the configuration of my AWS environment for the Bastion Instance to work properly?</h3>
                <p>Currently (this document was last updated in November 2015 so check with us if you are reading this from the future) there are a few important restrictions on supported AWS environemnts:</p>
                <ul>
                  <li>Opsee currently supports 1 Bastion Instance per customer. Your Bastion instance can only communicate within the region you choose for installation, so multiple regions are not supported</li>
                  <li>The Bastion Instance must communicate with Opsee to report on your health checks. If your Bastion Instance is in a VPC or subnet that cannot talk to Opsee servers, it will not work</li>
                  <li>If you have more than 1 VPC in your chosen region, you must choose a VPC to install your Bastion Instance. It is possible that the Bastion will not be able to communicate with other VPCs in your region, depending on your VPC configuration</li>
                  <li>The Bastion Instance automatically installs into the default subnet in your chosen VPC. If you are running multiple subnets, communication outside of the default subnet may not work, depending on your subnet configuration</li>
                </ul>
                <hr/>

                <h3>What kind of access and permissions does the Bastion Instance have to my environment?</h3>
                <p>You can see a complete overview of the Bastion Instance permissions in our <a href="/docs/cloudformation">Cloudformation template document</a>.</p>
                <hr/>

                <h3>Does Opsee install any software on my systems?</h3>
                <p>No. Opsee does not install any software on your systems.</p>
                <hr/>

                <h3>Tell me about the security measures Opsee has taken with the Bastion</h3>
                <p>We're glad you asked! The Bastion Instance is an Amazon AMI defined by a CloudFormation template. Its credentials are updated every hour. Any credentials it needs to run health checks are stored on an encrypted EBS volume inside your network. The Bastion Instance can even keep running if it can't connect to Opsee.</p>
                <hr/>

                <h3>How does the Bastion Instance handle VPCs?</h3>
                <p>Opsee allows you to choose a VPC to install your Bastion Instance. Since Opsee can only support 1 Bastion Instance per customer right now, installation in multiple VPCs is not yet supported. If VPC support is important to you, drop us a line at <a href="mailto:support@opsee.co">support@opsee.co</a>.</p>
                <hr/>

                <h3>How does the Bastion Instance handle subnets?</h3>
                <p>Opsee will choose the default subnet in your VPC to install the Bastion Instance. If you have multiple subnets and are interested in support, drop us a line at <a href="mailto:support@opsee.co">support@opsee.co</a>.</p>
                <hr/>

                <h3>Can I add more than one Bastion Instance?</h3>
                <p>You're only able to have 1 Bastion Instance in your environment right now. We're working on ways to add more Bastion Instances across multiple regions, VPCs, and subnets, and we'll keep you posted. If you're interested in this capability now, drop us a line at <a href="mailto:support@opsee.co">support@opsee.co</a>.</p>
                <hr/>

                <h3>What language is the Bastion Instance written in? Can I check out the source code?</h3>
                <p>The Bastion Instance is written in Go. If your company requires a source code review or if you simply want to do diligence on us, drop us a line at <a href="mailto:support@opsee.co">support@opsee.co</a>.</p>
                <hr/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Bastion;