import React, {PropTypes} from 'react';
import {plain as seed} from 'seedling';

import {Button} from '../forms';
import {Highlight, Toolbar} from '../global';
import {Expandable, Padding} from '../layout';
import {Heading} from '../type';
import crossAccountImg from '../../../img/tut-cross-account.svg';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Step 1: Launch our stack"/>

        <p>Opsee uses two tools to monitor your environment: cross-account access and our EC2 instance. We'll start by adding cross-account access.</p>

        <Padding>
          <img src={crossAccountImg} alt="Cross-account access between Opsee and your AWS environment" />
        </Padding>

        <Heading level={3}>About cross-account access</Heading>
        <p>Our cross-account role lets Opsee continuously discover what's in your environment and allows our instance to run health checks. You can view and control this access at any time in your IAM console.</p>

        <Heading level={4}>Cross-account Access CloudFormation Template</Heading>
        <p>We enable cross-account access using a CloudFormation template. You can review the template below, which sets all of the capabilities and permissions. It's also available in our docs.</p>

        <Padding>
          <Expandable style={{background: seed.color.gray9}}>
            <Highlight style={{padding: '1rem'}}>
              {JSON.stringify({ foo: 'bar' })}
            </Highlight>
          </Expandable>
        </Padding>

        <p>Next, you'll choose where to launch our CloudFormation stack.</p>
        <Button to="/s/region" color="success" block>Select a region</Button>
      </div>
    );
  }
});