import React from 'react';
import {Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Highlight} from '../global';
import {Padding} from '../layout';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: Cloudformation"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding tb={1}>
                <h3>The Opsee Bastion Instance CloudFormation Template</h3>
                <Highlight>
                {JSON.stringify(
                  {
                    'AWSTemplateFormatVersion': '2010-09-09',
                    'Description': 'The Opsee Bastion Host',
                    'Parameters': {
                      'InstanceType': {
                        'Description': 'EC2 Instance type (m3.medium, etc).',
                        'Type': 'String',
                        'Default': 'm3.medium',
                        'ConstraintDescription': 'Must be a valid EC2 instance type.'
                      },
                      'ImageId': {
                        'Description': 'The Opsee Bastion AMI',
                        'Type': 'String',
                        'ConstraintDescription': 'Must be a valid Opsee AMI.'
                      },
                      'UserData': {
                        'Description': 'Metadata to set for the instance',
                        'Type': 'String'
                      },
                      'KeyName': {
                        'Description': 'The name of a keypair to use.',
                        'Type': 'String'
                      },
                      'VpcId': {
                        'Description': 'The VPC in which to deploy the instance',
                        'Type': 'String',
                        'ConstraintDescription': 'Must be a valid VPC ID'
                      }
                    },
                    'Resources': {
                      'BastionSecurityGroup': {
                        'Type': 'AWS::EC2::SecurityGroup',
                        'Properties': {
                          'GroupDescription': 'Bastion SecurityGroup',
                          'Tags': [
                            {
                              'Key': 'Name',
                              'Value': 'Opsee Bastion Security Group'
                            },
                            {
                              'Key': 'type',
                              'Value': 'opsee'
                            }
                          ],
                          'SecurityGroupEgress': [
                            {
                              'CidrIp': '0.0.0.0/0',
                              'FromPort': -1,
                              'IpProtocol': -1,
                              'ToPort': -1
                            }
                          ],
                          'SecurityGroupIngress': [
                            {
                              'CidrIp': '0.0.0.0/0',
                              'FromPort': -1,
                              'IpProtocol': -1,
                              'ToPort': 22
                            }
                          ],
                          'VpcId': {
                            'Ref': 'VpcId'
                          }
                        }
                      },
                      'BastionRole': {
                        'Type': 'AWS::IAM::Role',
                        'Properties': {
                          'AssumeRolePolicyDocument': {
                            'Version': '2012-10-17',
                            'Statement': [
                              {
                                'Effect': 'Allow',
                                'Principal': {
                                  'Service': [
                                    'ec2.amazonaws.com'
                                  ]
                                },
                                'Action': [
                                  'sts:AssumeRole'
                                ]
                              }
                            ]
                          },
                          'Path': '/',
                          'Policies': [
                            {
                              'PolicyName': 'opsee',
                              'PolicyDocument': {
                                'Version': '2012-10-17',
                                'Statement': [
                                  {
                                    'Action': [
                                      'appstream:Get*',
                                      'autoscaling:Describe*',
                                      'cloudformation:DescribeStacks',
                                      'cloudformation:DescribeStackEvents',
                                      'cloudformation:DescribeStackResource',
                                      'cloudformation:DescribeStackResources',
                                      'cloudformation:GetTemplate',
                                      'cloudformation:List*',
                                      'cloudfront:Get*',
                                      'cloudfront:List*',
                                      'cloudtrail:DescribeTrails',
                                      'cloudtrail:GetTrailStatus',
                                      'cloudwatch:Describe*',
                                      'cloudwatch:Get*',
                                      'cloudwatch:List*',
                                      'directconnect:Describe*',
                                      'dynamodb:GetItem',
                                      'dynamodb:BatchGetItem',
                                      'dynamodb:Query',
                                      'dynamodb:Scan',
                                      'dynamodb:DescribeTable',
                                      'dynamodb:ListTables',
                                      'ec2:*',
                                      'elasticache:Describe*',
                                      'elasticbeanstalk:Check*',
                                      'elasticbeanstalk:Describe*',
                                      'elasticbeanstalk:List*',
                                      'elasticbeanstalk:RequestEnvironmentInfo',
                                      'elasticbeanstalk:RetrieveEnvironmentInfo',
                                      'elasticloadbalancing:Describe*',
                                      'elastictranscoder:Read*',
                                      'elastictranscoder:List*',
                                      'iam:List*',
                                      'iam:Get*',
                                      'kinesis:Describe*',
                                      'kinesis:Get*',
                                      'kinesis:List*',
                                      'opsworks:Describe*',
                                      'opsworks:Get*',
                                      'route53:Get*',
                                      'route53:List*',
                                      'redshift:Describe*',
                                      'redshift:ViewQueriesInConsole',
                                      'rds:Describe*',
                                      'rds:ListTagsForResource',
                                      's3:Get*',
                                      's3:List*',
                                      'sdb:GetAttributes',
                                      'sdb:List*',
                                      'sdb:Select*',
                                      'ses:Get*',
                                      'ses:List*',
                                      'sns:Get*',
                                      'sns:List*',
                                      'sqs:GetQueueAttributes',
                                      'sqs:ListQueues',
                                      'sqs:ReceiveMessage',
                                      'storagegateway:List*',
                                      'storagegateway:Describe*',
                                      'trustedadvisor:Describe*'
                                    ],
                                    'Effect': 'Allow',
                                    'Resource': '*'
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      },
                      'BastionInstanceProfile': {
                        'Type': 'AWS::IAM::InstanceProfile',
                        'Properties': {
                          'Path': '/',
                          'Roles': [
                            {
                              'Ref': 'BastionRole'
                            }
                          ]
                        }
                      },
                      'BastionInstance': {
                        'Type': 'AWS::EC2::Instance',
                        'Properties': {
                          'ImageId': {
                            'Ref': 'ImageId'
                          },
                          'IamInstanceProfile': {
                            'Ref': 'BastionInstanceProfile'
                          },
                          'InstanceType': {
                            'Ref': 'InstanceType'
                          },
                          'KeyName': {
                            'Ref': 'KeyName'
                          },
                          'SecurityGroupIds': [
                            {
                              'Ref': 'BastionSecurityGroup'
                            }
                          ],
                          'UserData': {
                            'Ref': 'UserData'
                          }
                        }
                      }
                    }
                  }, null, ' ')}
                </Highlight>
                <div><br/></div>

                  <h3>The IAM Role and Permissions</h3>

                  <p>Here is a summary of the role and permissions for the Opsee Bastion Instance.</p>

                  <Padding tb={1}>
                    <pre>elasticbeanstalk:RetrieveEnvironmentInfo</pre>
                    <p>Initiates a request to compile the specified type of information of the deployed environment.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_RequestEnvironmentInfo.html">API_RequestEnvironmentInfo</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>ec2:*</pre>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DecribeAccountAttributes.html">API_DecribeAccountAttributes</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeAddresses.html">API_DescribeAddresses</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeAvailabilityZones.html">API_DescribeAvailabilityZones</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeBundleTasks.html">API_DescribeBundleTasks</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeClassicLinkInstances.html">API_DescribeClassicLinkInstances</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeConversionTasks.html">API_DescribeConversionTasks</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeCustomerGateways.html">API_DescribeCustomerGateways</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeDhcpOptions.html">API_DescribeDhcpOptions</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeExportTasks.html">API_DescribeExportTasks</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeFlowLogs.html">API_DescribeFlowLogs</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImageAttribute.html">API_DescribeImageAttribute</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImages.html">API_DescribeImages</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImportImageTasks.html">API_DescribeImportImageTasks</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImportSnapshotTasks.html">API_DescribeImportSnapshotTasks</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceAttribute.html">API_DescribeInstanceAttribute</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstances.html">API_DescribeInstances</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceStatus.html">API_DescribeInstanceStatus</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInternetGateways.html">API_DescribeInternetGateways</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeKeyPairs.html">API_DescribeKeyPairs</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeMovingAddresses.html">API_DescribeMovingAddresses</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeNetworkAcls.html">API_DescribeNetworkAcls</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeNetworkInterfaceAttribute.html">API_DescribeNetworkInterfaceAttribute</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeNetworkInterfaces.html">API_DescribeNetworkInterfaces</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribePlacementGroups.html">API_DescribePlacementGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribePrefixLists.html">API_DescribePrefixLists</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeRegions.html">API_DescribeRegions</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeReservedInstances.html">API_DescribeReservedInstances</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeReservedInstancesListings.html">API_DescribeReservedInstancesListings</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeReservedInstancesModifications.html">API_DescribeReservedInstancesModifications</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeReservedInstancesOfferings.html">API_DescribeReservedInstancesOfferings</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeRouteTables.html">API_DescribeRouteTables</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSecurityGroups.html">API_DescribeSecurityGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSnapshotAttribute.html">API_DescribeSnapshotAttribute</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSnapshots.html">API_DescribeSnapshots</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotDatafeedSubscription.html">API_DescribeSpotDatafeedSubscription</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotFleetInstances.html">API_DescribeSpotFleetInstances</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotFleetRequestHistory.html">API_DescribeSpotFleetRequestHistory</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotFleetRequests.html">API_DescribeSpotFleetRequests</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotInstanceRequests.html">API_DescribeSpotInstanceRequests</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotPriceHistory.html">API_DescribeSpotPriceHistory</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSubnets.html">API_DescribeSubnets</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeTags.html">API_DescribeTags</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVolumeAttribute.html">API_DescribeVolumeAttribute</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVolumes.html">API_DescribeVolumes</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVolumeStatus.html">API_DescribeVolumeStatus</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcAttribute.html">API_DescribeVpcAttribute</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcClassicLink.html">API_DescribeVpcClassicLink</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcEndpoints.html">API_DescribeVpcEndpoints</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcEndpointServices.html">API_DescribeVpcEndpointServices</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcPeeringConnections.html">API_DescribeVpcPeeringConnections</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcs.html">API_DescribeVpcs</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpnConnections.html">API_DescribeVpnConnections</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpnGateways.html">API_DescribeVpnGateways</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elasticache:Describe*</pre>
                    <p>See elasticache Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheClusters.html">API_DescribeCacheClusters</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheEngineVersions.html">API_DescribeCacheEngineVersions</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheParameterGroups.html">API_DescribeCacheParameterGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheParameters.html">API_DescribeCacheParameters</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheSecurityGroups.html">API_DescribeCacheSecurityGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheSubnetGroups.html">API_DescribeCacheSubnetGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeEngineDefaultParameters.html">API_DescribeEngineDefaultParameters</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeEvents.html">API_DescribeEvents</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeReplicationGroups.html">API_DescribeReplicationGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeReservedCacheNodes.html">API_DescribeReservedCacheNodes</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeReservedCacheNodesOfferings.html">API_DescribeReservedCacheNodesOfferings</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeSnapshots.html">API_DescribeSnapshots</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sqs:GetQueueAttributes</pre>
                    <p>Gets attributes for the specified queue. </p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_GetQueueAttributes.html">API_GetQueueAttributes</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>kinesis:Describe*</pre>
                    <p>Describes the specified stream.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/kinesis/latest/APIReference/API_DescribeStream.html">API_DescribeStream</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudformation:DescribeStackResources</pre>
                    <p>Returns AWS resource descriptions for running and deleted stacks. If StackName is specified, all the associated resources that are part of the stack are returned. If PhysicalResourceId is specified, the associated resources of the stack that the resource belongs to are returned.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStackResources.html">API_DescribeStackResources</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>appstream:Get*</pre>
                    <p>The following policy grants users read-only access to Amazon AppStream.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/appstream/latest/developerguide/appstream-advanced-build-streaming-app.html">appstream-advanced-build-streaming-app</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elasticbeanstalk:Describe*</pre>
                    <p>See elasticbeanstalk Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeApplications.html">API_DescribeApplications</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeApplicationVersions.html">API_DescribeApplicationVersions</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeConfigurationOptions.html">API_DescribeConfigurationOptions</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeConfigurationSettings.html">API_DescribeConfigurationSettings</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironmentHealth.html">API_DescribeEnvironmentHealth</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironmentResources.html">API_DescribeEnvironmentResources</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironments.html">API_DescribeEnvironments</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEvents.html">API_DescribeEvents</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeInstancesHealth.html">API_DescribeInstancesHealth</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudfront:List*</pre>
                    <p>See cloudfront documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonCloudFront/latest/APIReference/Welcome.html">Welcome</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>route53:Get*</pre>
                    <p>See route53 api documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/Route53/latest/APIReference/Welcome.html">Welcome</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudformation:DescribeStackResource</pre>
                    <p>Returns a description of the specified resource in the specified stack.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStackResource.html">API_DescribeStackResource</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>dynamodb:DescribeTable</pre>
                    <p>Returns information about the table, including the current status of the table, when it was created, the primary key schema, and any indexes on the table.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html">API_DescribeTable</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>ses:List*</pre>
                    <p>See ses List*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_ListIdentities.html">API_ListIdentities</a></li>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_ListIdentityPolicies.html">API_ListIdentityPolicies</a></li>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_ListVerifiedEmailAddresses.html">API_ListVerifiedEmailAddresses</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>opsworks:Get*</pre>
                    <p>Gets a generated host name for the specified layer, based on the current host name theme.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_GetHostnameSuggestion.html">API_GetHostnameSuggestion</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudwatch:Describe*</pre>
                    <p>See cloudwatch DescribeAlarmsHistory, DescribeAlarms, DescribeAlarmsForMetric, DescribeAlarmActions</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_DescribeAlarmHistory.html">API_DescribeAlarmHistory</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_DescribeAlarms.html">API_DescribeAlarms</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_DescribeAlarmsForMetric.html">API_DescribeAlarmsForMetric</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elastictranscoder:Read*</pre>
                    <p>See elastictranscoder documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/elastictranscoder/latest/developerguide/introduction.html">introduction</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sns:List*</pre>
                    <p>See sns List*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_ListEndpointsByPlatformApplication.html">API_ListEndpointsByPlatformApplication</a></li>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_ListPlatformApplications.html">API_ListPlatformApplications</a></li>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_ListSubscriptions.html">API_ListSubscriptions</a></li>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_ListSubscriptionsByTopic.html">API_ListSubscriptionsByTopic</a></li>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_ListTopics.html">API_ListTopics</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>rds:ListTagsForResource</pre>
                    <p>Lists all tags on an Amazon RDS resource.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_ListTagsForResource.html">API_ListTagsForResource</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>opsworks:Describe*</pre>
                    <p>See opsworks Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeAgentVersions.html">API_DescribeAgentVersions</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeApps.html">API_DescribeApps</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeCommands.html">API_DescribeCommands</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeDeployments.html">API_DescribeDeployments</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeEcsClusters.html">API_DescribeEcsClusters</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeElasticIps.html">API_DescribeElasticIps</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeElasticLoadBalancers.html">API_DescribeElasticLoadBalancers</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeInstances.html">API_DescribeInstances</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeLayers.html">API_DescribeLayers</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeLoadBasedAutoScaling.html">API_DescribeLoadBasedAutoScaling</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeMyUserProfile.html">API_DescribeMyUserProfile</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribePermissions.html">API_DescribePermissions</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeRaidArrays.html">API_DescribeRaidArrays</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeRdsDbInstances.html">API_DescribeRdsDbInstances</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeServiceErrors.html">API_DescribeServiceErrors</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeStackProvisioningParameters.html">API_DescribeStackProvisioningParameters</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeStacks.html">API_DescribeStacks</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeStackSummary.html">API_DescribeStackSummary</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeTimeBasedAutoScaling.html">API_DescribeTimeBasedAutoScaling</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeUserProfiles.html">API_DescribeUserProfiles</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeVolumes.html">API_DescribeVolumes</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>redshift:ViewQueriesInConsole</pre>
                    <p>action controls whether a user can see queries in the Amazon Redshift console in the Queries tab of the Cluster section</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/mgmt/redshift-policy-elements.html">redshift-policy-elements</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>directconnect:Describe*</pre>
                    <p>See directconnect Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeConnections.html">API_DescribeConnections</a></li>
                      <li><a href="http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeConnectionsOnInterconnect.html">API_DescribeConnectionsOnInterconnect</a></li>
                      <li><a href="http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeInterconnects.html">API_DescribeInterconnects</a></li>
                      <li><a href="http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeInterconnects.html">API_DescribeInterconnects</a></li>
                      <li><a href="http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeLocations.html">API_DescribeLocations</a></li>
                      <li><a href="http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeVirtualGateways.html">API_DescribeVirtualGateways</a></li>
                      <li><a href="http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeVirtualInterfaces.html">API_DescribeVirtualInterfaces</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudformation:GetTemplate</pre>
                    <p>Returns the template body for a specified stack. You can get the template for running or deleted stacks. For deleted stacks, GetTemplate returns the template for up to 90 days after the stack has been deleted.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_GetTemplate.html">API_GetTemplate</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>iam:Get*</pre>
                    <p>See iam Get*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetAccessKeyLastUsed.html">API_GetAccessKeyLastUsed</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetAccountAuthorizationDetails.html">API_GetAccountAuthorizationDetails</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetAccountPasswordPolicy.html">API_GetAccountPasswordPolicy</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetAccountSummary.html">API_GetAccountSummary</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetContextKeysForCustomPolicy.html">API_GetContextKeysForCustomPolicy</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetContextKeysForPrincipalPolicy.html">API_GetContextKeysForPrincipalPolicy</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetCredentialReport.html">API_GetCredentialReport</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetGroup.html">API_GetGroup</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetGroupPolicy.html">API_GetGroupPolicy</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetInstanceProfile.html">API_GetInstanceProfile</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetLoginProfile.html">API_GetLoginProfile</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetOpenIDConnectProvider.html">API_GetOpenIDConnectProvider</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetPolicy.html">API_GetPolicy</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetPolicyVersion.html">API_GetPolicyVersion</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetRole.html">API_GetRole</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetRolePolicy.html">API_GetRolePolicy</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetSAMLProvider.html">API_GetSAMLProvider</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetServerCertificate.html">API_GetServerCertificate</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetSSHPublicKey.html">API_GetSSHPublicKey</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetUser.html">API_GetUser</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetUserPolicy.html">API_GetUserPolicy</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elasticbeanstalk:List*</pre>
                    <p>Returns a list of the available solution stack names.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_ListAvailableSolutionStacks.html">API_ListAvailableSolutionStacks</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>dynamodb:GetItem</pre>
                    <p>The GetItem operation returns a set of attributes for the item with the given primary key. If there is no matching item, GetItem does not return any data.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html">API_GetItem</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudwatch:List*</pre>
                    <p>See cloudwatch ListMetrics</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_ListMetrics.html">API_ListMetrics</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>dynamodb:ListTables</pre>
                    <p>Returns an array of table names associated with the current account and endpoint. The output from ListTables is paginated, with each page returning a maximum of 100 table names.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ListTables.html">API_ListTables</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>trustedadvisor:Describe*</pre>
                    <p>See support api documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/awssupport/latest/APIReference/Welcome.html">Welcome</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>kinesis:List*</pre>
                    <p>See kinesis ListStreams,ListTagsForStream</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/kinesis/latest/APIReference/API_ListStreams.html">API_ListStreams</a></li>
                      <li><a href="http://docs.aws.amazon.com/kinesis/latest/APIReference/API_ListStreams.html">API_ListStreams</a></li>
                      <li><a href="http://docs.aws.amazon.com/kinesis/latest/APIReference/API_ListTagsForStream.html">API_ListTagsForStream</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>iam:List*</pre>
                    <p>See iam List*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAccessKeys.html">API_ListAccessKeys</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAccountAliases.html">API_ListAccountAliases</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAttachedGroupPolicies.html">API_ListAttachedGroupPolicies</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAttachedRolePolicies.html">API_ListAttachedRolePolicies</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAttachedUserPolicies.html">API_ListAttachedUserPolicies</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListEntitiesForPolicy.html">API_ListEntitiesForPolicy</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListGroupPolicies.html">API_ListGroupPolicies</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListGroups.html">API_ListGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListGroupsForUser.html">API_ListGroupsForUser</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListInstanceProfiles.html">API_ListInstanceProfiles</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListInstanceProfilesForRole.html">API_ListInstanceProfilesForRole</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListMFADevices.html">API_ListMFADevices</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListOpenIDConnectProviders.html">API_ListOpenIDConnectProviders</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListPolicies.html">API_ListPolicies</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListPolicyVersions.html">API_ListPolicyVersions</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListRolePolicies.html">API_ListRolePolicies</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListRoles.html">API_ListRoles</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListSAMLProviders.html">API_ListSAMLProviders</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListServerCertificates.html">API_ListServerCertificates</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListSigningCertificates.html">API_ListSigningCertificates</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListSSHPublicKeys.html">API_ListSSHPublicKeys</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListUserPolicies.html">API_ListUserPolicies</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListUsers.html">API_ListUsers</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListVirtualMFADevices.html">API_ListVirtualMFADevices</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>s3:Get*</pre>
                    <p>See s3 api documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html">Welcome</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elastictranscoder:List*</pre>
                    <p>See elastictranscoder documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/elastictranscoder/latest/developerguide/introduction.html">introduction</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudtrail:DescribeTrails</pre>
                    <p>Retrieves settings for the trail associated with the current region for your account.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/awscloudtrail/latest/APIReference/API_DescribeTrails.html">API_DescribeTrails</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elasticloadbalancing:Describe*</pre>
                    <p>See elasticloadbalancing Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeInstanceHealth.html">API_DescribeInstanceHealth</a></li>
                      <li><a href="http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancerAttributes.html">API_DescribeLoadBalancerAttributes</a></li>
                      <li><a href="http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancerPolicies.html">API_DescribeLoadBalancerPolicies</a></li>
                      <li><a href="http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancerPolicyTypes.html">API_DescribeLoadBalancerPolicyTypes</a></li>
                      <li><a href="http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancers.html">API_DescribeLoadBalancers</a></li>
                      <li><a href="http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeTags.html">API_DescribeTags</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sns:Get*</pre>
                    <p>See sns Get*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_GetEndpointAttributes.html">API_GetEndpointAttributes</a></li>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_GetPlatformApplicationAttributes.html">API_GetPlatformApplicationAttributes</a></li>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_GetSubscriptionAttributes.html">API_GetSubscriptionAttributes</a></li>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_GetTopicAttributes.html">API_GetTopicAttributes</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elasticbeanstalk:RequestEnvironmentInfo</pre>
                    <p>See elasticbeanstalk Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeApplications.html">API_DescribeApplications</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeApplicationVersions.html">API_DescribeApplicationVersions</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeConfigurationOptions.html">API_DescribeConfigurationOptions</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeConfigurationSettings.html">API_DescribeConfigurationSettings</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironmentHealth.html">API_DescribeEnvironmentHealth</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironmentResources.html">API_DescribeEnvironmentResources</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironments.html">API_DescribeEnvironments</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEvents.html">API_DescribeEvents</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeInstancesHealth.html">API_DescribeInstancesHealth</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sqs:ListQueues</pre>
                    <p>Returns a list of your queues.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_ListQueues.html">API_ListQueues</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sdb:GetAttributes</pre>
                    <p>Returns all of the attributes associated with the item.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_GetAttributes.html">SDB_API_GetAttributes</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sdb:List*</pre>
                    <p>The ListDomains operation lists all domains associated with the Access Key ID.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_ListDomains.html">SDB_API_ListDomains</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>rds:Describe*</pre>
                    <p>See rds Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeAccountAttributes.html">API_DescribeAccountAttributes</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeCertificates.html">API_DescribeCertificates</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBClusterParameterGroups.html">API_DescribeDBClusterParameterGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBClusterParameters.html">API_DescribeDBClusterParameters</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBClusters.html">API_DescribeDBClusters</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBClusterSnapshots.html">API_DescribeDBClusterSnapshots</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBEngineVersions.html">API_DescribeDBEngineVersions</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBInstances.html">API_DescribeDBInstances</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBLogFiles.html">API_DescribeDBLogFiles</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBParameterGroups.html">API_DescribeDBParameterGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBParameters.html">API_DescribeDBParameters</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBSecurityGroups.html">API_DescribeDBSecurityGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBSnapshots.html">API_DescribeDBSnapshots</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBSubnetGroups.html">API_DescribeDBSubnetGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEngineDefaultClusterParameters.html">API_DescribeEngineDefaultClusterParameters</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEngineDefaultParameters.html">API_DescribeEngineDefaultParameters</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEventCategories.html">API_DescribeEventCategories</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEvents.html">API_DescribeEvents</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEventSubscriptions.html">API_DescribeEventSubscriptions</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeOptionGroupOptions.html">API_DescribeOptionGroupOptions</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeOptionGroups.html">API_DescribeOptionGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeOrderableDBInstanceOptions.html">API_DescribeOrderableDBInstanceOptions</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribePendingMaintenanceActions.html">API_DescribePendingMaintenanceActions</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeReservedDBInstances.html">API_DescribeReservedDBInstances</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeReservedDBInstancesOfferings.html">API_DescribeReservedDBInstancesOfferings</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudformation:DescribeStacks</pre>
                    <p>Returns the description for the specified stack; if no stack name was specified, then it returns the description for all the stacks created</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStacks.html">API_DescribeStacks</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>autoscaling:Describe*</pre>
                    <p>See autoscaling Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAccountLimits.html">API_DescribeAccountLimits</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAdjustmentTypes.html">API_DescribeAdjustmentTypes</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAutoScalingGroups.html">API_DescribeAutoScalingGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAutoScalingInstances.html">API_DescribeAutoScalingInstances</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAutoScalingNotificationTypes.html">API_DescribeAutoScalingNotificationTypes</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeLaunchConfigurations.html">API_DescribeLaunchConfigurations</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeLifecycleHooks.html">API_DescribeLifecycleHooks</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeLifecycleHookTypes.html">API_DescribeLifecycleHookTypes</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeLoadBalancers.html">API_DescribeLoadBalancers</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeMetricCollectionTypes.html">API_DescribeMetricCollectionTypes</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeNotificationConfigurations.html">API_DescribeNotificationConfigurations</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribePolicies.html">API_DescribePolicies</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeScalingActivities.html">API_DescribeScalingActivities</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeScalingProcessTypes.html">API_DescribeScalingProcessTypes</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeScheduledActions.html">API_DescribeScheduledActions</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeTags.html">API_DescribeTags</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeTerminationPolicyTypes.html">API_DescribeTerminationPolicyTypes</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>dynamodb:BatchGetItem</pre>
                    <p>The BatchGetItem operation returns the attributes of one or more items from one or more tables. You identify requested items by primary key.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html">API_BatchGetItem</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudfront:Get*</pre>
                    <p>See cloudfront documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonCloudFront/latest/APIReference/Welcome.html">Welcome</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>route53:List*</pre>
                    <p>See route53 api documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/Route53/latest/APIReference/Welcome.html">Welcome</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>dynamodb:Query</pre>
                    <p>A Query operation uses the primary key of a table or a secondary index to directly access items from that table or index.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html">API_Query</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>storagegateway:Describe*</pre>
                    <p>See storagegateway Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeCache.html">API_DescribeCache</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeCachediSCSIVolumes.html">API_DescribeCachediSCSIVolumes</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeChapCredentials.html">API_DescribeChapCredentials</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeGatewayInformation.html">API_DescribeGatewayInformation</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeMaintenanceStartTime.html">API_DescribeMaintenanceStartTime</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeSnapshotSchedule.html">API_DescribeSnapshotSchedule</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeStorediSCSIVolumes.html">API_DescribeStorediSCSIVolumes</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeTapeArchives.html">API_DescribeTapeArchives</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeTapeRecoveryPoints.html">API_DescribeTapeRecoveryPoints</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DDescribeTapes.html">API_DDescribeTapes</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeUploadBuffer.html">API_DescribeUploadBuffer</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeVTLDevices.html">API_DescribeVTLDevices</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeWorkingStorage.html">API_DescribeWorkingStorage</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudtrail:GetTrailStatus</pre>
                    <p>Returns a JSON-formatted list of information about the specified trail. Fields include information on delivery errors, Amazon SNS and Amazon S3 errors, and start and stop logging times for each trail.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/awscloudtrail/latest/APIReference/API_GetTrailStatus.html">API_GetTrailStatus</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>s3:List*</pre>
                    <p>See s3 api documentatin</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html">Welcome</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>kinesis:Get*</pre>
                    <p>See kinesis GetRecords, GetShardIterator</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/kinesis/latest/APIReference/API_GetRecords.html">API_GetRecords</a></li>
                      <li><a href="http://docs.aws.amazon.com/kinesis/latest/APIReference/API_GetShardIterator.html">API_GetShardIterator</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>dynamodb:Scan</pre>
                    <p>The Scan operation returns one or more items and item attributes by accessing every item in a table or a secondary index.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html">API_Scan</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>ses:Get*</pre>
                    <p>See ses Get*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_GetIdentityDkimAttributes.html">API_GetIdentityDkimAttributes</a></li>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_GetIdentityNotificationAttributes.html">API_GetIdentityNotificationAttributes</a></li>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_GetIdentityPolicies.html">API_GetIdentityPolicies</a></li>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_GetIdentityVerificationAttributes.html">API_GetIdentityVerificationAttributes</a></li>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_GetSendQuota.html">API_GetSendQuota</a></li>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_GetSendStatistics.html">API_GetSendStatistics</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elasticbeanstalk:Check*</pre>
                    <p>Checks if the specified CNAME is available.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_CheckDNSAvailability.html">API_CheckDNSAvailability</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>redshift:Describe*</pre>
                    <p>See redshift Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterParameterGroups.html">API_DescribeClusterParameterGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterParameters.html">API_DescribeClusterParameters</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusters.html">API_DescribeClusters</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterSecurityGroups.html">API_DescribeClusterSecurityGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterSecurityGroups.html">API_DescribeClusterSecurityGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterSnapshots.html">API_DescribeClusterSnapshots</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterSubnetGroups.html">API_DescribeClusterSubnetGroups</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterVersions.html">API_DescribeClusterVersions</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeDefaultClusterParameters.html">API_DescribeDefaultClusterParameters</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeEventCategories.html">API_DescribeEventCategories</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeEvents.html">API_DescribeEvents</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeEventSubscriptions.html">API_DescribeEventSubscriptions</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeHsmClientCertificates.html">API_DescribeHsmClientCertificates</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeHsmConfigurations.html">API_DescribeHsmConfigurations</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeLoggingStatus.html">API_DescribeLoggingStatus</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeLoggingStatus.html">API_DescribeLoggingStatus</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeOrderableClusterOptions.html">API_DescribeOrderableClusterOptions</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeReservedNodeOfferings.html">API_DescribeReservedNodeOfferings</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeReservedNodes.html">API_DescribeReservedNodes</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeResize.html">API_DescribeResize</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeSnapshotCopyGrants.html">API_DescribeSnapshotCopyGrants</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeTags.html">API_DescribeTags</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudformation:DescribeStackEvents</pre>
                    <p>Returns all stack related events for a specified stack. For more information about a stack event history, go to Stacks in the AWS CloudFormation User Guide.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStackEvents.html">API_DescribeStackEvents</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudformation:List*</pre>
                    <p>See cloudformation ListStacks and ListResources</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ListStacks.html">API_ListStacks</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ListStackResources.html">API_ListStackResources</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sqs:ReceiveMessage</pre>
                    <p>Retrieves one or more messages, with a maximum limit of 10 messages, from the specified queue. Long poll support is enabled by using the WaitTimeSeconds parameter.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_ReceiveMessage.html">API_ReceiveMessage</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudwatch:Get*</pre>
                    <p>See cloudwatch GetMetricStatistics</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_GetMetricStatistics.html">API_GetMetricStatistics</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>storagegateway:List*</pre>
                    <p>See storagegateway List*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListGateways.html">API_ListGateways</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListLocalDisks">API_ListLocalDisks</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListTagsForResource">API_ListTagsForResource</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListVolumeInitiators">API_ListVolumeInitiators</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListVolumeRecoveryPoints">API_ListVolumeRecoveryPoints</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListVolumes">API_ListVolumes</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sdb:Select*</pre>
                    <p>The Select operation returns a set of Attributes for ItemNames that match the select expression. Select is similar to the standard SQL SELECT statement.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li>
                        <a href="http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_Select.html">SDB_API_Select.html
                        </a>
                      </li>
                    </ul>
                  </Padding>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});