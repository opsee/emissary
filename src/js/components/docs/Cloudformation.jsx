import React, {PropTypes} from 'react';
import {Toolbar, HTMLFile} from '../global';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Highlight} from '../global';
import {Padding} from '../layout';
import {Button} from '../forms';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: Cloudformation"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding tb={1}>
                <h2>The Opsee Bastion Instance CloudFormation Template</h2>
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

                  <h2>The IAM Role and Permissions</h2>

                  <p>Here is a summary of the role and permissions for the Opsee Bastion Instance.</p>

                  <Padding tb={1}>
                    <pre>elasticbeanstalk:RetrieveEnvironmentInfo</pre>
                    <p>Initiates a request to compile the specified type of information of the deployed environment.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_RequestEnvironmentInfo.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_RequestEnvironmentInfo.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>ec2:*</pre>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DecribeAccountAttributes.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DecribeAccountAttributes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeAddresses.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeAddresses.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeAvailabilityZones.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeAvailabilityZones.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeBundleTasks.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeBundleTasks.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeClassicLinkInstances.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeClassicLinkInstances.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeConversionTasks.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeConversionTasks.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeCustomerGateways.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeCustomerGateways.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeDhcpOptions.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeDhcpOptions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeExportTasks.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeExportTasks.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeFlowLogs.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeFlowLogs.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImageAttribute.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImageAttribute.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImages.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImages.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImportImageTasks.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImportImageTasks.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImportSnapshotTasks.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeImportSnapshotTasks.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceAttribute.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceAttribute.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstances.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstances.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceStatus.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceStatus.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInternetGateways.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInternetGateways.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeKeyPairs.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeKeyPairs.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeMovingAddresses.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeMovingAddresses.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeNetworkAcls.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeNetworkAcls.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeNetworkInterfaceAttribute.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeNetworkInterfaceAttribute.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeNetworkInterfaces.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeNetworkInterfaces.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribePlacementGroups.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribePlacementGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribePrefixLists.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribePrefixLists.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeRegions.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeRegions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeReservedInstances.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeReservedInstances.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeReservedInstancesListings.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeReservedInstancesListings.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeReservedInstancesModifications.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeReservedInstancesModifications.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeReservedInstancesOfferings.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeReservedInstancesOfferings.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeRouteTables.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeRouteTables.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSecurityGroups.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSecurityGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSnapshotAttribute.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSnapshotAttribute.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSnapshots.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSnapshots.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotDatafeedSubscription.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotDatafeedSubscription.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotFleetInstances.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotFleetInstances.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotFleetRequestHistory.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotFleetRequestHistory.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotFleetRequests.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotFleetRequests.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotInstanceRequests.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotInstanceRequests.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotPriceHistory.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSpotPriceHistory.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSubnets.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeSubnets.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeTags.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeTags.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVolumeAttribute.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVolumeAttribute.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVolumes.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVolumes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVolumeStatus.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVolumeStatus.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcAttribute.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcAttribute.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcClassicLink.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcClassicLink.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcEndpoints.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcEndpoints.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcEndpointServices.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcEndpointServices.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcPeeringConnections.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcPeeringConnections.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcs.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcs.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpnConnections.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpnConnections.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpnGateways.html">http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpnGateways.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elasticache:Describe*</pre>
                    <p>See elasticache Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheClusters.html">http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheClusters.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheEngineVersions.html">http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheEngineVersions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheParameterGroups.html">http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheParameterGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheParameters.html">http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheParameters.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheSecurityGroups.html">http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheSecurityGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheSubnetGroups.html">http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeCacheSubnetGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeEngineDefaultParameters.html">http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeEngineDefaultParameters.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeEvents.html">http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeEvents.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeReplicationGroups.html">http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeReplicationGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeReservedCacheNodes.html">http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeReservedCacheNodes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeReservedCacheNodesOfferings.html">http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeReservedCacheNodesOfferings.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeSnapshots.html">http://docs.aws.amazon.com/AmazonElastiCache/latest/APIReference/API_DescribeSnapshots.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sqs:GetQueueAttributes</pre>
                    <p>Gets attributes for the specified queue. </p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_GetQueueAttributes.html">http://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_GetQueueAttributes.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>kinesis:Describe*</pre>
                    <p>Describes the specified stream.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/kinesis/latest/APIReference/API_DescribeStream.html">http://docs.aws.amazon.com/kinesis/latest/APIReference/API_DescribeStream.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudformation:DescribeStackResources</pre>
                    <p>Returns AWS resource descriptions for running and deleted stacks. If StackName is specified, all the associated resources that are part of the stack are returned. If PhysicalResourceId is specified, the associated resources of the stack that the resource belongs to are returned.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStackResources.html">http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStackResources.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>appstream:Get*</pre>
                    <p>The following policy grants users read-only access to Amazon AppStream.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/appstream/latest/developerguide/appstream-advanced-build-streaming-app.html">http://docs.aws.amazon.com/appstream/latest/developerguide/appstream-advanced-build-streaming-app.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elasticbeanstalk:Describe*</pre>
                    <p>See elasticbeanstalk Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeApplications.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeApplications.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeApplicationVersions.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeApplicationVersions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeConfigurationOptions.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeConfigurationOptions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeConfigurationSettings.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeConfigurationSettings.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironmentHealth.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironmentHealth.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironmentResources.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironmentResources.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironments.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironments.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEvents.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEvents.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeInstancesHealth.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeInstancesHealth.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudfront:List*</pre>
                    <p>See cloudfront documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonCloudFront/latest/APIReference/Welcome.html">http://docs.aws.amazon.com/AmazonCloudFront/latest/APIReference/Welcome.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>route53:Get*</pre>
                    <p>See route53 api documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/Route53/latest/APIReference/Welcome.html">http://docs.aws.amazon.com/Route53/latest/APIReference/Welcome.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudformation:DescribeStackResource</pre>
                    <p>Returns a description of the specified resource in the specified stack.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStackResource.html">http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStackResource.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>dynamodb:DescribeTable</pre>
                    <p>Returns information about the table, including the current status of the table, when it was created, the primary key schema, and any indexes on the table.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html">http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>ses:List*</pre>
                    <p>See ses List*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_ListIdentities.html">http://docs.aws.amazon.com/ses/latest/APIReference/API_ListIdentities.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_ListIdentityPolicies.html">http://docs.aws.amazon.com/ses/latest/APIReference/API_ListIdentityPolicies.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_ListVerifiedEmailAddresses.html">http://docs.aws.amazon.com/ses/latest/APIReference/API_ListVerifiedEmailAddresses.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>opsworks:Get*</pre>
                    <p>Gets a generated host name for the specified layer, based on the current host name theme.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_GetHostnameSuggestion.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_GetHostnameSuggestion.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudwatch:Describe*</pre>
                    <p>See cloudwatch DescribeAlarmsHistory, DescribeAlarms, DescribeAlarmsForMetric, DescribeAlarmActions</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_DescribeAlarmHistory.html">http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_DescribeAlarmHistory.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_DescribeAlarms.html">http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_DescribeAlarms.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_DescribeAlarmsForMetric.html">http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_DescribeAlarmsForMetric.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elastictranscoder:Read*</pre>
                    <p>See elastictranscoder documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/elastictranscoder/latest/developerguide/introduction.html">http://docs.aws.amazon.com/elastictranscoder/latest/developerguide/introduction.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sns:List*</pre>
                    <p>See sns List*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_ListEndpointsByPlatformApplication.html">http://docs.aws.amazon.com/sns/latest/api/API_ListEndpointsByPlatformApplication.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_ListPlatformApplications.html">http://docs.aws.amazon.com/sns/latest/api/API_ListPlatformApplications.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_ListSubscriptions.html">http://docs.aws.amazon.com/sns/latest/api/API_ListSubscriptions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_ListSubscriptionsByTopic.html">http://docs.aws.amazon.com/sns/latest/api/API_ListSubscriptionsByTopic.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_ListTopics.html">http://docs.aws.amazon.com/sns/latest/api/API_ListTopics.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>rds:ListTagsForResource</pre>
                    <p>Lists all tags on an Amazon RDS resource.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_ListTagsForResource.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_ListTagsForResource.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>opsworks:Describe*</pre>
                    <p>See opsworks Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeAgentVersions.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeAgentVersions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeApps.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeApps.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeCommands.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeCommands.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeDeployments.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeDeployments.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeEcsClusters.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeEcsClusters.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeElasticIps.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeElasticIps.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeElasticLoadBalancers.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeElasticLoadBalancers.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeInstances.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeInstances.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeLayers.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeLayers.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeLoadBasedAutoScaling.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeLoadBasedAutoScaling.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeMyUserProfile.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeMyUserProfile.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribePermissions.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribePermissions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeRaidArrays.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeRaidArrays.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeRdsDbInstances.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeRdsDbInstances.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeServiceErrors.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeServiceErrors.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeStackProvisioningParameters.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeStackProvisioningParameters.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeStacks.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeStacks.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeStackSummary.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeStackSummary.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeTimeBasedAutoScaling.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeTimeBasedAutoScaling.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeUserProfiles.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeUserProfiles.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeVolumes.html">http://docs.aws.amazon.com/opsworks/latest/APIReference/API_DescribeVolumes.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>redshift:ViewQueriesInConsole</pre>
                    <p>action controls whether a user can see queries in the Amazon Redshift console in the Queries tab of the Cluster section</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/mgmt/redshift-policy-elements.html">http://docs.aws.amazon.com/redshift/latest/mgmt/redshift-policy-elements.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>directconnect:Describe*</pre>
                    <p>See directconnect Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeConnections.html">http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeConnections.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeConnectionsOnInterconnect.html">http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeConnectionsOnInterconnect.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeInterconnects.html">http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeInterconnects.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeInterconnects.html">http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeInterconnects.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeLocations.html">http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeLocations.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeVirtualGateways.html">http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeVirtualGateways.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeVirtualInterfaces.html">http://docs.aws.amazon.com/directconnect/latest/APIReference/API_DescribeVirtualInterfaces.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudformation:GetTemplate</pre>
                    <p>Returns the template body for a specified stack. You can get the template for running or deleted stacks. For deleted stacks, GetTemplate returns the template for up to 90 days after the stack has been deleted.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_GetTemplate.html">http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_GetTemplate.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>iam:Get*</pre>
                    <p>See iam Get*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetAccessKeyLastUsed.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetAccessKeyLastUsed.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetAccountAuthorizationDetails.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetAccountAuthorizationDetails.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetAccountPasswordPolicy.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetAccountPasswordPolicy.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetAccountSummary.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetAccountSummary.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetContextKeysForCustomPolicy.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetContextKeysForCustomPolicy.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetContextKeysForPrincipalPolicy.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetContextKeysForPrincipalPolicy.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetCredentialReport.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetCredentialReport.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetGroup.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetGroup.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetGroupPolicy.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetGroupPolicy.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetInstanceProfile.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetInstanceProfile.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetLoginProfile.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetLoginProfile.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetOpenIDConnectProvider.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetOpenIDConnectProvider.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetPolicy.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetPolicy.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetPolicyVersion.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetPolicyVersion.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetRole.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetRole.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetRolePolicy.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetRolePolicy.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetSAMLProvider.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetSAMLProvider.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetServerCertificate.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetServerCertificate.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetSSHPublicKey.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetSSHPublicKey.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetUser.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetUser.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetUserPolicy.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_GetUserPolicy.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elasticbeanstalk:List*</pre>
                    <p>Returns a list of the available solution stack names.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_ListAvailableSolutionStacks.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_ListAvailableSolutionStacks.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>dynamodb:GetItem</pre>
                    <p>The GetItem operation returns a set of attributes for the item with the given primary key. If there is no matching item, GetItem does not return any data.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html">http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudwatch:List*</pre>
                    <p>See cloudwatch ListMetrics</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_ListMetrics.html">http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_ListMetrics.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>dynamodb:ListTables</pre>
                    <p>Returns an array of table names associated with the current account and endpoint. The output from ListTables is paginated, with each page returning a maximum of 100 table names.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ListTables.html">http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ListTables.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>trustedadvisor:Describe*</pre>
                    <p>See support api documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/awssupport/latest/APIReference/Welcome.html">http://docs.aws.amazon.com/awssupport/latest/APIReference/Welcome.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>kinesis:List*</pre>
                    <p>See kinesis ListStreams,ListTagsForStream</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/kinesis/latest/APIReference/API_ListStreams.html">http://docs.aws.amazon.com/kinesis/latest/APIReference/API_ListStreams.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/kinesis/latest/APIReference/API_ListStreams.html">http://docs.aws.amazon.com/kinesis/latest/APIReference/API_ListStreams.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/kinesis/latest/APIReference/API_ListTagsForStream.html">http://docs.aws.amazon.com/kinesis/latest/APIReference/API_ListTagsForStream.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>iam:List*</pre>
                    <p>See iam List*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAccessKeys.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAccessKeys.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAccountAliases.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAccountAliases.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAttachedGroupPolicies.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAttachedGroupPolicies.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAttachedRolePolicies.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAttachedRolePolicies.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAttachedUserPolicies.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListAttachedUserPolicies.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListEntitiesForPolicy.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListEntitiesForPolicy.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListGroupPolicies.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListGroupPolicies.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListGroups.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListGroupsForUser.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListGroupsForUser.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListInstanceProfiles.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListInstanceProfiles.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListInstanceProfilesForRole.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListInstanceProfilesForRole.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListMFADevices.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListMFADevices.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListOpenIDConnectProviders.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListOpenIDConnectProviders.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListPolicies.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListPolicies.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListPolicyVersions.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListPolicyVersions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListRolePolicies.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListRolePolicies.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListRoles.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListRoles.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListSAMLProviders.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListSAMLProviders.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListServerCertificates.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListServerCertificates.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListSigningCertificates.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListSigningCertificates.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListSSHPublicKeys.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListSSHPublicKeys.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListUserPolicies.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListUserPolicies.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListUsers.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListUsers.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListVirtualMFADevices.html">http://docs.aws.amazon.com/IAM/latest/APIReference/API_ListVirtualMFADevices.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>s3:Get*</pre>
                    <p>See s3 api documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html">http://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elastictranscoder:List*</pre>
                    <p>See elastictranscoder documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/elastictranscoder/latest/developerguide/introduction.html">http://docs.aws.amazon.com/elastictranscoder/latest/developerguide/introduction.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudtrail:DescribeTrails</pre>
                    <p>Retrieves settings for the trail associated with the current region for your account.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/awscloudtrail/latest/APIReference/API_DescribeTrails.html">http://docs.aws.amazon.com/awscloudtrail/latest/APIReference/API_DescribeTrails.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elasticloadbalancing:Describe*</pre>
                    <p>See elasticloadbalancing Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeInstanceHealth.html">http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeInstanceHealth.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancerAttributes.html">http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancerAttributes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancerPolicies.html">http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancerPolicies.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancerPolicyTypes.html">http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancerPolicyTypes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancers.html">http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeLoadBalancers.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeTags.html">http://docs.aws.amazon.com/ElasticLoadBalancing/latest/APIReference/API_DescribeTags.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sns:Get*</pre>
                    <p>See sns Get*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_GetEndpointAttributes.html">http://docs.aws.amazon.com/sns/latest/api/API_GetEndpointAttributes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_GetPlatformApplicationAttributes.html">http://docs.aws.amazon.com/sns/latest/api/API_GetPlatformApplicationAttributes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_GetSubscriptionAttributes.html">http://docs.aws.amazon.com/sns/latest/api/API_GetSubscriptionAttributes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/sns/latest/api/API_GetTopicAttributes.html">http://docs.aws.amazon.com/sns/latest/api/API_GetTopicAttributes.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elasticbeanstalk:RequestEnvironmentInfo</pre>
                    <p>See elasticbeanstalk Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeApplications.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeApplications.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeApplicationVersions.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeApplicationVersions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeConfigurationOptions.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeConfigurationOptions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeConfigurationSettings.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeConfigurationSettings.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironmentHealth.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironmentHealth.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironmentResources.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironmentResources.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironments.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEnvironments.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEvents.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeEvents.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeInstancesHealth.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_DescribeInstancesHealth.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sqs:ListQueues</pre>
                    <p>Returns a list of your queues.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_ListQueues.html">http://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_ListQueues.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sdb:GetAttributes</pre>
                    <p>Returns all of the attributes associated with the item.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_GetAttributes.html">http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_GetAttributes.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sdb:List*</pre>
                    <p>The ListDomains operation lists all domains associated with the Access Key ID.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_ListDomains.html">http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_ListDomains.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>rds:Describe*</pre>
                    <p>See rds Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeAccountAttributes.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeAccountAttributes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeCertificates.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeCertificates.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBClusterParameterGroups.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBClusterParameterGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBClusterParameters.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBClusterParameters.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBClusters.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBClusters.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBClusterSnapshots.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBClusterSnapshots.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBEngineVersions.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBEngineVersions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBInstances.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBInstances.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBLogFiles.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBLogFiles.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBParameterGroups.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBParameterGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBParameters.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBParameters.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBSecurityGroups.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBSecurityGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBSnapshots.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBSnapshots.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBSubnetGroups.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeDBSubnetGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEngineDefaultClusterParameters.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEngineDefaultClusterParameters.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEngineDefaultParameters.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEngineDefaultParameters.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEventCategories.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEventCategories.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEvents.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEvents.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEventSubscriptions.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeEventSubscriptions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeOptionGroupOptions.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeOptionGroupOptions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeOptionGroups.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeOptionGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeOrderableDBInstanceOptions.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeOrderableDBInstanceOptions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribePendingMaintenanceActions.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribePendingMaintenanceActions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeReservedDBInstances.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeReservedDBInstances.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeReservedDBInstancesOfferings.html">http://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DescribeReservedDBInstancesOfferings.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudformation:DescribeStacks</pre>
                    <p>Returns the description for the specified stack; if no stack name was specified, then it returns the description for all the stacks created</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStacks.html">http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStacks.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>autoscaling:Describe*</pre>
                    <p>See autoscaling Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAccountLimits.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAccountLimits.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAdjustmentTypes.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAdjustmentTypes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAutoScalingGroups.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAutoScalingGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAutoScalingInstances.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAutoScalingInstances.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAutoScalingNotificationTypes.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeAutoScalingNotificationTypes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeLaunchConfigurations.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeLaunchConfigurations.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeLifecycleHooks.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeLifecycleHooks.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeLifecycleHookTypes.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeLifecycleHookTypes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeLoadBalancers.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeLoadBalancers.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeMetricCollectionTypes.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeMetricCollectionTypes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeNotificationConfigurations.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeNotificationConfigurations.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribePolicies.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribePolicies.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeScalingActivities.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeScalingActivities.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeScalingProcessTypes.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeScalingProcessTypes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeScheduledActions.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeScheduledActions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeTags.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeTags.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeTerminationPolicyTypes.html">http://docs.aws.amazon.com/AutoScaling/latest/APIReference/API_DescribeTerminationPolicyTypes.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>dynamodb:BatchGetItem</pre>
                    <p>The BatchGetItem operation returns the attributes of one or more items from one or more tables. You identify requested items by primary key.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html">http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudfront:Get*</pre>
                    <p>See cloudfront documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonCloudFront/latest/APIReference/Welcome.html">http://docs.aws.amazon.com/AmazonCloudFront/latest/APIReference/Welcome.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>route53:List*</pre>
                    <p>See route53 api documentation</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/Route53/latest/APIReference/Welcome.html">http://docs.aws.amazon.com/Route53/latest/APIReference/Welcome.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>dynamodb:Query</pre>
                    <p>A Query operation uses the primary key of a table or a secondary index to directly access items from that table or index.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html">http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>storagegateway:Describe*</pre>
                    <p>See storagegateway Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeCache.html">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeCache.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeCachediSCSIVolumes.html">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeCachediSCSIVolumes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeChapCredentials.html">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeChapCredentials.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeGatewayInformation.html">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeGatewayInformation.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeMaintenanceStartTime.html">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeMaintenanceStartTime.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeSnapshotSchedule.html">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeSnapshotSchedule.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeStorediSCSIVolumes.html">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeStorediSCSIVolumes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeTapeArchives.html">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeTapeArchives.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeTapeRecoveryPoints.html">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeTapeRecoveryPoints.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DDescribeTapes.html">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DDescribeTapes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeUploadBuffer.html">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeUploadBuffer.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeVTLDevices.html">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeVTLDevices.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeWorkingStorage.html">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_DescribeWorkingStorage.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudtrail:GetTrailStatus</pre>
                    <p>Returns a JSON-formatted list of information about the specified trail. Fields include information on delivery errors, Amazon SNS and Amazon S3 errors, and start and stop logging times for each trail.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/awscloudtrail/latest/APIReference/API_GetTrailStatus.html">http://docs.aws.amazon.com/awscloudtrail/latest/APIReference/API_GetTrailStatus.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>s3:List*</pre>
                    <p>See s3 api documentatin</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html">http://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>kinesis:Get*</pre>
                    <p>See kinesis GetRecords, GetShardIterator</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/kinesis/latest/APIReference/API_GetRecords.html">http://docs.aws.amazon.com/kinesis/latest/APIReference/API_GetRecords.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/kinesis/latest/APIReference/API_GetShardIterator.html">http://docs.aws.amazon.com/kinesis/latest/APIReference/API_GetShardIterator.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>dynamodb:Scan</pre>
                    <p>The Scan operation returns one or more items and item attributes by accessing every item in a table or a secondary index.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html">http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>ses:Get*</pre>
                    <p>See ses Get*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_GetIdentityDkimAttributes.html">http://docs.aws.amazon.com/ses/latest/APIReference/API_GetIdentityDkimAttributes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_GetIdentityNotificationAttributes.html">http://docs.aws.amazon.com/ses/latest/APIReference/API_GetIdentityNotificationAttributes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_GetIdentityPolicies.html">http://docs.aws.amazon.com/ses/latest/APIReference/API_GetIdentityPolicies.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_GetIdentityVerificationAttributes.html">http://docs.aws.amazon.com/ses/latest/APIReference/API_GetIdentityVerificationAttributes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_GetSendQuota.html">http://docs.aws.amazon.com/ses/latest/APIReference/API_GetSendQuota.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/ses/latest/APIReference/API_GetSendStatistics.html">http://docs.aws.amazon.com/ses/latest/APIReference/API_GetSendStatistics.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>elasticbeanstalk:Check*</pre>
                    <p>Checks if the specified CNAME is available.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_CheckDNSAvailability.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/api/API_CheckDNSAvailability.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>redshift:Describe*</pre>
                    <p>See redshift Describe*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterParameterGroups.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterParameterGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterParameters.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterParameters.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusters.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusters.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterSecurityGroups.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterSecurityGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterSecurityGroups.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterSecurityGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterSnapshots.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterSnapshots.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterSubnetGroups.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterSubnetGroups.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterVersions.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeClusterVersions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeDefaultClusterParameters.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeDefaultClusterParameters.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeEventCategories.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeEventCategories.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeEvents.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeEvents.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeEventSubscriptions.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeEventSubscriptions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeHsmClientCertificates.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeHsmClientCertificates.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeHsmConfigurations.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeHsmConfigurations.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeLoggingStatus.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeLoggingStatus.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeLoggingStatus.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeLoggingStatus.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeOrderableClusterOptions.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeOrderableClusterOptions.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeReservedNodeOfferings.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeReservedNodeOfferings.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeReservedNodes.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeReservedNodes.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeResize.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeResize.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeSnapshotCopyGrants.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeSnapshotCopyGrants.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeTags.html">http://docs.aws.amazon.com/redshift/latest/APIReference/API_DescribeTags.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudformation:DescribeStackEvents</pre>
                    <p>Returns all stack related events for a specified stack. For more information about a stack event history, go to Stacks in the AWS CloudFormation User Guide.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStackEvents.html">http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_DescribeStackEvents.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudformation:List*</pre>
                    <p>See cloudformation ListStacks and ListResources</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ListStacks.html">http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ListStacks.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ListStackResources.html">http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_ListStackResources.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sqs:ReceiveMessage</pre>
                    <p>Retrieves one or more messages, with a maximum limit of 10 messages, from the specified queue. Long poll support is enabled by using the WaitTimeSeconds parameter.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_ReceiveMessage.html">http://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_ReceiveMessage.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>cloudwatch:Get*</pre>
                    <p>See cloudwatch GetMetricStatistics</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_GetMetricStatistics.html">http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_GetMetricStatistics.html</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>storagegateway:List*</pre>
                    <p>See storagegateway List*</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListGateways.html">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListGateways.html</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListLocalDisks">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListLocalDisks</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListTagsForResource">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListTagsForResource</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListVolumeInitiators">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListVolumeInitiators</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListVolumeRecoveryPoints">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListVolumeRecoveryPoints</a></li>
                      <li><a href="http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListVolumes">http://docs.aws.amazon.com/storagegateway/latest/APIReference/API_ListVolumes</a></li>
                    </ul>
                  </Padding>

                  <Padding tb={1}>
                    <pre>sdb:Select*</pre>
                    <p>The Select operation returns a set of Attributes for ItemNames that match the select expression. Select is similar to the standard SQL SELECT statement.</p>
                    <p>Reference URL(s):</p>
                    <ul>
                      <li>
                        <a href="http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_Select.html">http://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/SDB_API_Select.html
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