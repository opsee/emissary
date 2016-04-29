import React, {PropTypes} from 'react';
import {plain as seed} from 'seedling';

import {Button} from '../forms';
import {Highlight, Toolbar} from '../global';
import {Expandable, Padding} from '../layout';
import {Heading} from '../type';
import ec2InstaceImage from '../../../img/tut-ec2-instance.svg';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Step 2: Add our EC2 Instance"/>
        <p>Now we're going to add our EC2 instance to your environment. <strong>This is the last step in installation... hooray!</strong></p>

        <Heading level={3}>Our EC2 Instance</Heading>
        <p>The instance is a t2.micro and is free-tier eligible. It's responsible for running checks,
        and it inherits all of its permissions from the cross-account role you set up in the last step.
        The instance is controlled by both a CloudFormation template and an Ingress IAM Role,
        which are both available in are documentation.</p>

        <Padding>
          <img src={ec2InstaceImage} alt="Our EC2 instance inside your AWS environment" />
        </Padding>

        <Heading level={4}>Instance CloudFormation Template</Heading>
        <p>Used to install our EC2 instance. Notably, we create a security group and
        auto-scale group (to set rules requiring at least one running Opsee instance
        at all times), and add our instance to both groups.</p>

        <Padding>
          <Expandable style={{background: seed.color.gray9}}>
            <Highlight style={{padding: '1rem'}}>
              {JSON.stringify({ foo: 'bar' })}
            </Highlight>
          </Expandable>
        </Padding>

        <Heading level={4}>Ingress IAM Role</Heading>
        <p>Used to ensure communication between your security groups and the Opsee security group
        within your chosen VPC.</p>

        <Padding>
          <Expandable style={{background: seed.color.gray9}}>
            <Highlight style={{padding: '1rem'}}>
              {JSON.stringify({ foo: 'bar' })}
            </Highlight>
          </Expandable>
        </Padding>

        <p>If you have any questions, you reach out to us any time on email, Slack, or IRC.</p>

        <Button to="/s/choose-vpc" color="success" block>Choose a VPC</Button>
      </div>
    );
  }
})