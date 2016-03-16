import React from 'react';

import {BastionRequirement, Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Heading} from '../type';

const Bastion = React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: The Bastion Instance"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <BastionRequirement/>
              <p>Here are some frequently asked questions and answers about the Opsee Bastion Instance:</p>

                <Heading level={3}>What is the Opsee Bastion Instance?</Heading>
                <p>The Bastion Instance is an EC2 instance running Opsee software. It receives instructions from your Opsee app and runs the health checks you prescribe.</p>
                <hr/>

                <Heading level={3}>What type of instance is the Bastion? How much does it cost to run?</Heading>
                <p>The Bastion instance is a <a target="_blank" href="https://aws.amazon.com/ec2/instance-types/">t2.micro instance</a> and it is completely <strong>FREE</strong> to run. In the future we plan to offer larger sizes with greater processing capability, but we will keep you posted when that happens.</p>
                <hr/>

                <Heading level={3}>How does the Bastion Instance discover what is running in my AWS Environment?</Heading>
                <p>The Bastion Instance only uses readily available AWS APIs to discover your Instances, Groups, Services, and other AWS data.</p>
                <hr/>

                <Heading level={3}>Are there any constraints on the configuration of my AWS environment for the Bastion Instance to work properly?</Heading>
                <p>Currently (this document was last updated in March 2016 so check with us if you are reading this from the future) there are a few important restrictions on supported AWS environemnts:</p>
                <ul>
                  <li>Opsee currently supports 1 Bastion Instance per customer. Your Bastion instance can only communicate within the VPC you choose for installation. If you have multiple VPCs and multiple regions, support is coming soon. Reach out to us for more info: <a href="mailto:support@opsee.co">support@opsee.co</a>.</li>
                  <li>The Bastion Instance must be able to communicate with Opsee to report on your health checks. We recommend adding our instance to a Public or NATed subnet, which we will ask you about during installation. There, it will be able to talk to both Opsee and your other VPCs, unless you have ingress/egress rules prohibiting that. If so, you will need to allow traffic from our bastion instance.</li>
                  <li>The Bastion cannot be installed in EC2 Classic. It must be installed in a VPC and subnet.</li>
                </ul>
                <hr/>

                <Heading level={3}>What kind of access and permissions does the Bastion Instance have to my environment?</Heading>
                <p>In addition to permissions for the Bastion Instance itself, Opsee needs to ensure that the Bastion Instance can communicate with the rest of your infrastructure. In order to ensure that the Opsee Bastion can communicate with your services to perform health checks, a process running on the Bastion will periodically examine the security groups in your AWS environment.  If groups are found with which the bastion cannot communicate, ingress rules will be created via the AWS API so that services within those groups can be monitored. All ingress rules are created, updated, and deleted via the modification of a special cloudformation stack that resides in the region which the bastion was installed. You can see all of the security groups to which the bastion has access by examining the ingress stack&rsquo;s template body.</p>
                <hr/>

                <Heading level={3}>Does Opsee install any software on my systems?</Heading>
                <p>No. Opsee does not install any software on your systems.</p>
                <hr/>

                <Heading level={3}>Tell me about the security measures Opsee has taken with the Bastion</Heading>
                <p>We&rsquo;re glad you asked! The Bastion Instance is a t2.micro EC2 instance running an Opsee Bastion AMI within an Autoscaling Group.  The Autoscaling Group is defined by a CloudFormation template and managed via a CloudFormation stack that resides in the region within which the bastion was installed. The Bastion&rsquo;s credentials are updated every hour. Any credentials it needs to run health checks are stored on an encrypted EBS volume inside your network. The Bastion Instance can even keep running if it can&rsquo;t connect to Opsee.</p>
                <hr/>

                <Heading level={3}>How does the Bastion Instance handle VPCs?</Heading>
                <p>Opsee allows you to choose a VPC to install your Bastion Instance. Since Opsee can only support 1 Bastion Instance per customer right now, installation in multiple VPCs is not yet supported. If you have multiple VPCs and multiple regions, support is coming soon. Reach out to us for more info: <a href="mailto:support@opsee.co">support@opsee.co</a>.</p>
                <hr/>

                <Heading level={3}>How does the Bastion Instance handle subnets?</Heading>
                <p>You can choose a subnet to add our instance to during on-boarding. We recommend adding our instance to a Public or NATed subnet, which we will ask you about during installation. There, it will be able to talk to both Opsee and your other VPCs, unless you have ingress/egress rules prohibiting that. If so, you will need to allow traffic from our bastion instance.</p>
                <hr/>

                <Heading level={3}>Can I add more than one Bastion Instance?</Heading>
                <p>You&rsquo;re only able to have 1 Bastion Instance in your environment right now. If you have multiple VPCs and multiple regions, support is coming soon. Reach out to us for more info: <a href="mailto:support@opsee.co">support@opsee.co</a>.</p>
                <hr/>

                <Heading level={3}>What language is the Bastion Instance written in? Can I check out the source code?</Heading>
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
