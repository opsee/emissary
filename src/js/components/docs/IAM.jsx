import React, {PropTypes} from 'react';
import {Button} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: IAM Profile for Bastion Installation"/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
            <h2>Overview</h2>
            <p>The Opsee onboarding process requires <em>temporary access to your AWS resources</em>. This access will be used to install and start the Opsee Bastion EC2 Instance.  The Bastion is responsible for discovering and monitoring your AWS services.</p>

            <h2>Setup via the creation of an IAM User</h2>
            <p>This section describes how to complete the onboarding process by creating an IAM User and attaching an Access Policy to that user.</p>


            <h3>Create an IAM User</h3>
            <p>IAM Users allow you to delegate access to AWS services to third parties.  Opsee will utilize the IAM User you provide during the installation of the bastion. IAM Users are created via the IAM section of the AWS console.</p>
            <p>If you have trouble creating an IAM User for the onboarding process, refer to the <a href="http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html">AWS Guide on IAM User setup</a>.</p>


            <h3>Attach an Access Policy to the  IAM User</h3>
            <p>First, login to the <a href="https://console.aws.amazon.com/iam/home?#groups">AWS IAM Management Console</a></p>
            <p>The Access Policy you attach to the previously created IAM User limits what resources the User (in this case, Opsee) has access to. For more information on this Policy Element, refer to the Access Policy section of the <a href="http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html">AWS Policy Elements Documentation</a>.</p>

            <p>To ensure proper instalation of the bastion, attach the following policy the IAM User you created in the last section.</p>

            <pre>&#123;
  "Version": "2015-09-17",
  "Statement": [
    &#123;
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "ec2:*",
        "rds:*",
        "iam:AddRoleToInstanceProfile",
        "iam:CreateInstanceProfile",
        "iam:CreateRole",
        "iam:DeleteInstanceProfile",
        "iam:DeleteRole",
        "iam:DeleteRolePolicy",
        "iam:GetRole",
        "iam:PassRole",
        "iam:PutRolePolicy",
        "iam:RemoveRoleFromInstanceProfile"
      ],
      "Resource": "*"
    &#124;
  ]
&#124;</pre>

            <h3>Finishing Up</h3>
            <p>The final step of the process is to provide opsee with the credentials for the IAM User Account.  To do this, you will need to create an access key for the IAM User you have created.</p>

            <ol>
              <li>If for some reason you are not already signed in, sign in to the AWS Management Console and open the IAM console at https://console.aws.amazon.com/iam/</li>
              <li>In the navigation pane, click Users.</li>
              <li>Click the name of the IAM user you created for the onboarding process, then scroll down to the Security Credentials section.</li>
              <li>To create an access key, click Create Access Key and then click Download Credentials to save the access key ID and secret access key to a CSV file on your computer.</li>
              <li>Open the CSV file with an appropriate editor like Excel (windows), Numbers (OSX), or an editor bundled with LibreOffice or OpenOffice (windows/osx/linux)</li>
              <li>Copy the key from the *Access Key Id* and *Secret Access Key* columns into the appropriate input fields in the Opsee Onboarding User Interface.</li>
            </ol>

            <p>If you have trouble creating an access key for the IAM User, refer to the <a href="http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html">AWS Documentation on Creating an Access Key for an IAM User</a>.</p>


            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
