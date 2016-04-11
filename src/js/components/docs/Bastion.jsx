import React from 'react';

import {BastionRequirement, Toolbar} from '../global';
import {Col, Grid, Row} from '../layout';
import {Heading} from '../type';

const Bastion = React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: The Opsee EC2 Instance"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <BastionRequirement/>
              <p>Here are some frequently asked questions and answers about the Opsee EC2 Instance:</p>

                <Heading level={3}>What type of instance is it? How much does it cost to run?</Heading>
                <p>Our instance is a <a target="_blank" href="https://aws.amazon.com/ec2/pricing/">t2.micro instance and is free-tier eligible</a>. In the future we plan to offer larger sizes with greater processing capability, but we will keep you posted when that happens.</p>
                <hr/>

                <Heading level={3}>How does the instance discover what is running in my AWS Environment?</Heading>
                <p>Out instance uses AWS APIs to discover your Instances, Groups, Services, and other AWS environment data. With <a href="/docs/permissions">a few exceptions</a>, the instance has read-only access to these APIs.</p>
                <hr/>

                <Heading level={3}>Are there any constraints on the configuration of my AWS environment for the instance to work properly?</Heading>
                <p>Currently (this document was last updated in March 2016 so check with us if you are reading this from the future) there are a few important restrictions on supported AWS environemnts:</p>
                <ul>
                  <li>Opsee currently supports 1 instance per customer. Your instance can only communicate within the VPC you choose for installation. If you have multiple VPCs and multiple regions, support is coming soon. Reach out to us for more info: <a href="mailto:support@opsee.co">support@opsee.co</a>.</li>
                  <li>The instance must be able to communicate with Opsee to report on your health checks. We recommend adding our instance to a Public or NATed subnet, which we will ask you about during installation. There, it will be able to talk to both Opsee and your other VPCs, unless you have ingress/egress rules prohibiting that. If so, you will need to allow traffic from our security group to yours.</li>
                  <li>The instance cannot be installed in EC2 Classic. It must be installed in a VPC and subnet.</li>
                </ul>
                <hr/>

                <Heading level={3}>What kind of access and permissions does your instance have to my environment?</Heading>
                <p>In addition to permissions for the instance itself, Opsee needs to ensure that our instance can communicate with the rest of your infrastructure. To ensure this, a process running on the instance will periodically examine the security groups in your AWS environment. If it finds groups our instance cannot communicate with, ingress rules will be created via the AWS API so that services within those groups can be monitored. All ingress rules are created, updated, and deleted via the modification of a special <a href="/docs/permissions">CloudFormation stack</a> that resides in the region which the instance was installed. You can <a target="_blank" href="https://console.aws.amazon.com/cloudformation/home">see all of the security groups</a> the has access to by examining the ingress stack&rsquo;s template body.</p>
                <hr/>

                <Heading level={3}>Does Opsee install any software on my systems?</Heading>
                <p>No. Opsee does not install any software on your systems.</p>
                <hr/>

                <Heading level={3}>Tell me about the security measures Opsee has taken with the Instance</Heading>
                <p>We&rsquo;re glad you asked! Our Instance is a t2.micro running an Opsee AMI within an Autoscaling Group.  The Autoscaling Group is defined by a <a href="/docs/permissions">CloudFormation template</a> and managed via a CloudFormation stack that resides in the region within which the instance was installed. The instance&rsquo;s credentials are updated every hour. Any credentials it needs to run health checks are stored on an encrypted EBS volume inside your network. The instance can even keep running if it can&rsquo;t connect to Opsee.</p>
                <hr/>

                <Heading level={3}>How does the instance handle VPCs?</Heading>
                <p>Opsee allows you to choose a VPC to install your instance. Since Opsee can only support 1 instance per customer right now, installation in multiple VPCs is not yet supported. If you have multiple VPCs and multiple regions, support is coming soon. Reach out to us for more info: <a href="mailto:support@opsee.co">support@opsee.co</a>.</p>
                <hr/>

                <Heading level={3}>How does the instance handle subnets?</Heading>
                <p>You can choose a subnet to add our instance to during on-boarding. We recommend adding our instance to a Public or NATed subnet, which we will ask you about during installation. There, it will be able to talk to both Opsee and your other VPCs, unless you have ingress/egress rules prohibiting that. If so, you will need to allow traffic from our  instance.</p>
                <hr/>

                <Heading level={3}>What language is the instance written in? Can I inspect the source code?</Heading>
                <p>The instance is written in Go. If your company requires a source code review or if you simply want to do diligence on us, drop us a line at <a href="mailto:support@opsee.co">support@opsee.co</a>.</p>
                <hr/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Bastion;
