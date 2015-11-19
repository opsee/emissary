import React from 'react';
import {Link} from 'react-router';
import {Toolbar, Highlight} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: IAM Profile for Bastion Installation"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <div>
                <h2>Overview</h2>
                <p>The Opsee onboarding process requires <em>temporary access to your AWS resources</em>. This access will only be used to install and start the Opsee Bastion EC2 Instance.  The Bastion is responsible for discovering and monitoring your AWS services. To learn more about the Bastion Instance <Link to="/docsBastion" >see the FAQ</Link>.</p>

                <h2>Setup via the creation of an IAM User</h2>
                <p>This section describes how to complete the onboarding process by creating an IAM User and attaching an Access Policy to that user.</p>

                <h3>Create an IAM User</h3>
                <p>IAM Users allow you to delegate access to AWS services to third parties.  Opsee will utilize the IAM User you provide during the installation of the bastion. IAM Users are created via the IAM section of the AWS console.</p>
                <p>If you have trouble creating an IAM User for the onboarding process, refer to the <a href="http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html">AWS Guide on IAM User setup</a>.</p>

                <h3>Create and attach and Access Policy to the IAM User</h3>

                <p>The Access Policy you attach to the previously created IAM User limits what resources the User (in this case, Opsee) has access to. For more information on this Policy Element, refer to the section entitled Access Policy in the <a href="http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html">AWS Policy Elements Documentation</a>. Follow the steps listed below to apply the policy to the user you created in the previous section.</p>

                <ol>
                  <li>If for some reason you are not already signed in, sign in to the AWS Management Console and open the IAM console at <a target="_blank" href="https://console.aws.amazon.com/iam/">https://console.aws.amazon.com/iam/</a></li>
                  <li>In the navigation pane, click <strong>Users</strong></li>
                  <li>If you don't already have a user ready for this purpose, click <strong>Create New Users</strong></li>
                  <li>Click the name of the IAM user you created for the onboarding process, then scroll down to the tab/section called Permissions</li>
                  <li>Expand the <em>Inline Policies</em> section, and click <strong>Create User Policy</strong></li>
                  <li>Choose <em>Custom Policy</em> and click <strong>Select</strong></li>
                  <li>Enter a name for your policy in the input area labled Policy Name</li>
                  <li>Copy and paste the policy listed below into the  and click <strong>Validate Policy</strong></li>
                  <li>If a validation error occurs, verify that you have copied the entire Policy from the box below. If you have trouble, contact us at <a href="mailto:support@opsee.com">support@opsee.com</a></li>
                  <li>If no errors have occurred, click <strong>Apply Policy</strong></li>
                </ol>
                <Highlight>
                {JSON.stringify({
                  'Version': '2012-10-17',
                  'Statement': [
                    {
                      'Effect': 'Allow',
                      'Action': [
                        'cloudformation:*',
                        'ec2:*',
                        'rds:*',
                        'iam:AddRoleToInstanceProfile',
                        'iam:CreateInstanceProfile',
                        'iam:CreateRole',
                        'iam:DeleteInstanceProfile',
                        'iam:DeleteRole',
                        'iam:DeleteRolePolicy',
                        'iam:GetRole',
                        'iam:PassRole',
                        'iam:PutRolePolicy',
                        'iam:RemoveRoleFromInstanceProfile'
                      ],
                      'Resource': '*'
                    }
                  ]
                }, null, ' ')}
                </Highlight>

                <h3>Provide Opsee Your IAM User Credentials</h3>
                <p>The final step of the process is to provide opsee with the credentials for the IAM User Account.  To do this, you will need to create an access key for the IAM User you have created.</p>

                <ol>
                  <li>If for some reason you are not already signed in, sign in to the AWS Management Console and open the IAM console at <a target="_blank" href="https://console.aws.amazon.com/iam/">https://console.aws.amazon.com/iam/</a></li>
                  <li>In the navigation pane, click <strong>Users</strong></li>
                  <li>Click the name of the IAM user you created for the onboarding process, then scroll down to the <em>Security Credentials</em> section</li>
                  <li>To create an access key, click <strong>Create Access Key</strong> and then click <strong>Download Credentials</strong> to save the <em>access key ID</em> and <em>secret key</em> to a CSV file</li>
                  <li>Open the CSV file with an appropriate editor</li>
                  <li>Copy the key from the <em>Access Key Id</em> and <em>Secret Access Key</em> columns into the appropriate input fields in the Opsee AWS credentials screen</li>
                </ol>

                <p>If you have trouble creating an access key for the IAM User, refer to the <a href="http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html">AWS Documentation on Creating an Access Key for an IAM User</a>.</p>
                </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});