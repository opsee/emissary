export default {
  'groups': [
    {
      'group': {
        'Instances': [
          {
            'InstanceId': 'i-38aae6fa'
          },
          {
            'InstanceId': 'i-822ff347'
          }
        ],
        'Subnets': [
          'subnet-0378a966',
          'subnet-eccedfaa'
        ],
        'DNSName': 'api-lb-869858987.us-west-1.elb.amazonaws.com',
        'VPCId': 'vpc-79b1491c',
        'LoadBalancerName': 'api-lb',
        'CanonicalHostedZoneName': 'api-lb-869858987.us-west-1.elb.amazonaws.com',
        'SourceSecurityGroup': {
          'GroupName': 'api-lb',
          'OwnerAlias': '933693344490'
        },
        'AvailabilityZones': [
          'us-west-1c',
          'us-west-1a'
        ],
        'HealthCheck': {
          'Target': 'HTTP:8080/health_check',
          'Timeout': 5,
          'Interval': 30,
          'HealthyThreshold': 2,
          'UnhealthyThreshold': 2
        },
        'SecurityGroups': [
          'sg-ac528bc9'
        ],
        'ListenerDescriptions': [
          {
            'Listener': {
              'Protocol': 'SSL',
              'InstancePort': 4080,
              'InstanceProtocol': 'TCP',
              'LoadBalancerPort': 4080,
              'SSLCertificateId': 'arn:aws:iam::933693344490:server-certificate/OpseeCoWildcard'
            },
            'PolicyNames': [
              'ELBSecurityPolicy-2015-05'
            ]
          },
          {
            'Listener': {
              'Protocol': 'SSL',
              'InstancePort': 8080,
              'InstanceProtocol': 'TCP',
              'LoadBalancerPort': 443,
              'SSLCertificateId': 'arn:aws:iam::933693344490:server-certificate/OpseeCoWildcard'
            },
            'PolicyNames': [
              'ELBSecurityPolicy-2015-05'
            ]
          }
        ],
        'CreatedTime': '2015-01-20T02:45:57.55Z',
        'Scheme': 'internet-facing',
        'CanonicalHostedZoneNameID': 'Z1M58G0W56PQJA'
      },
      'instance_count': 2,
      'results': [
        {
          'check_id': '39TbkyFhQwVFANFtudhW2P',
          'service': '39TbkyFhQwVFANFtudhW2P',
          'key': 'api-lb',
          'time': 1447349163,
          'type': 'result',
          'state': true,
          'passing': true,
          'host': 'api-lb',
          'responses': [
            {
              'response': {
                'type_url': 'HttpResponse',
                'value': {
                  'code': 200,
                  'body': 'A ok',
                  'headers': [
                    {
                      'name': 'Server',
                      'values': [
                        'Jetty(9.2.z-SNAPSHOT)'
                      ]
                    },
                    {
                      'name': 'Content-Type',
                      'values': [
                        'text/html; charset=UTF-8'
                      ]
                    },
                    {
                      'name': 'Vary',
                      'values': [
                        'origin'
                      ]
                    },
                    {
                      'name': 'Content-Length',
                      'values': [
                        '4'
                      ]
                    }
                  ],
                  'metrics': [
                    {
                      'name': 'request_latency_ms',
                      'value': 2.013955
                    }
                  ]
                }
              },
              'check_id': '39TbkyFhQwVFANFtudhW2P',
              'service': '39TbkyFhQwVFANFtudhW2P',
              'time': 1447349163,
              'type': 'response',
              'state': true,
              'passing': true,
              'host': 'i-38aae6fa',
              'target': {
                'type': 'instance',
                'id': 'i-38aae6fa',
                'address': '172.31.8.48'
              },
              'customer_id': '5bb82086-51c6-11e5-9b33-db6aaaf21de2'
            },
            {
              'response': {
                'type_url': 'HttpResponse',
                'value': {
                  'code': 200,
                  'body': 'A ok',
                  'headers': [
                    {
                      'name': 'Content-Type',
                      'values': [
                        'text/html; charset=UTF-8'
                      ]
                    },
                    {
                      'name': 'Vary',
                      'values': [
                        'origin'
                      ]
                    },
                    {
                      'name': 'Content-Length',
                      'values': [
                        '4'
                      ]
                    },
                    {
                      'name': 'Server',
                      'values': [
                        'Jetty(9.2.z-SNAPSHOT)'
                      ]
                    }
                  ],
                  'metrics': [
                    {
                      'name': 'request_latency_ms',
                      'value': 12.658608
                    }
                  ]
                }
              },
              'check_id': '39TbkyFhQwVFANFtudhW2P',
              'service': '39TbkyFhQwVFANFtudhW2P',
              'time': 1447349163,
              'type': 'response',
              'state': true,
              'passing': true,
              'host': 'i-822ff347',
              'target': {
                'type': 'instance',
                'id': 'i-822ff347',
                'address': '172.31.13.234'
              },
              'customer_id': '5bb82086-51c6-11e5-9b33-db6aaaf21de2'
            }
          ],
          'target': {
            'name': 'api-lb',
            'type': 'elb',
            'id': 'api-lb'
          },
          'timestamp': 1447349163,
          'customer_id': '5bb82086-51c6-11e5-9b33-db6aaaf21de2'
        }
      ]
    },
    {
      'group': {
        'Instances': [
          {
            'InstanceId': 'i-20f122e5'
          },
          {
            'InstanceId': 'i-38aae6fa'
          },
          {
            'InstanceId': 'i-39aae6fb'
          },
          {
            'InstanceId': 'i-822ff347'
          }
        ],
        'Subnets': [
          'subnet-0378a966',
          'subnet-eccedfaa'
        ],
        'DNSName': 'api-lb-com-1143078159.us-west-1.elb.amazonaws.com',
        'VPCId': 'vpc-79b1491c',
        'LoadBalancerName': 'api-lb-com',
        'CanonicalHostedZoneName': 'api-lb-com-1143078159.us-west-1.elb.amazonaws.com',
        'SourceSecurityGroup': {
          'GroupName': 'api-opsee-com',
          'OwnerAlias': '933693344490'
        },
        'AvailabilityZones': [
          'us-west-1a',
          'us-west-1c'
        ],
        'HealthCheck': {
          'Target': 'HTTP:8080/health_check',
          'Timeout': 5,
          'Interval': 30,
          'HealthyThreshold': 2,
          'UnhealthyThreshold': 2
        },
        'SecurityGroups': [
          'sg-ffdea69a'
        ],
        'ListenerDescriptions': [
          {
            'Listener': {
              'Protocol': 'HTTPS',
              'InstancePort': 80,
              'InstanceProtocol': 'HTTP',
              'LoadBalancerPort': 443,
              'SSLCertificateId': 'arn:aws:iam::933693344490:server-certificate/cloudfront/OpseeComWildcard'
            },
            'PolicyNames': [
              'AWSConsole-SSLNegotiationPolicy-api-lb-com-1442608382628'
            ]
          },
          {
            'Listener': {
              'Protocol': 'SSL',
              'InstancePort': 4080,
              'InstanceProtocol': 'SSL',
              'LoadBalancerPort': 4080,
              'SSLCertificateId': 'arn:aws:iam::933693344490:server-certificate/cloudfront/OpseeComWildcard'
            },
            'PolicyNames': [
              'AWSConsole-SSLNegotiationPolicy-api-lb-com-1442608382628'
            ]
          }
        ],
        'CreatedTime': '2015-09-18T20:33:00.34Z',
        'Scheme': 'internet-facing',
        'CanonicalHostedZoneNameID': 'Z1M58G0W56PQJA'
      },
      'instance_count': 4,
      'results': []
    },
    {
      'group': {
        'Instances': [
          {
            'InstanceId': 'i-20f122e5'
          },
          {
            'InstanceId': 'i-39aae6fb'
          }
        ],
        'Subnets': [
          'subnet-0378a966',
          'subnet-eccedfaa'
        ],
        'DNSName': 'app-lb-com-2111889638.us-west-1.elb.amazonaws.com',
        'VPCId': 'vpc-79b1491c',
        'LoadBalancerName': 'app-lb-com',
        'CanonicalHostedZoneName': 'app-lb-com-2111889638.us-west-1.elb.amazonaws.com',
        'SourceSecurityGroup': {
          'GroupName': 'app-com-lb',
          'OwnerAlias': '933693344490'
        },
        'AvailabilityZones': [
          'us-west-1a',
          'us-west-1c'
        ],
        'HealthCheck': {
          'Target': 'HTTP:80/index.html',
          'Timeout': 5,
          'Interval': 30,
          'HealthyThreshold': 2,
          'UnhealthyThreshold': 2
        },
        'SecurityGroups': [
          'sg-68d6ae0d'
        ],
        'ListenerDescriptions': [
          {
            'Listener': {
              'Protocol': 'HTTPS',
              'InstancePort': 443,
              'InstanceProtocol': 'HTTPS',
              'LoadBalancerPort': 443,
              'SSLCertificateId': 'arn:aws:iam::933693344490:server-certificate/cloudfront/OpseeComWildcard'
            },
            'PolicyNames': [
              'AWSConsole-SSLNegotiationPolicy-app-lb-com-1442619084403'
            ]
          },
          {
            'Listener': {
              'Protocol': 'TCP',
              'InstancePort': 4080,
              'InstanceProtocol': 'TCP',
              'LoadBalancerPort': 4080,
              'SSLCertificateId': null
            },
            'PolicyNames': null
          }
        ],
        'CreatedTime': '2015-09-18T23:31:23.15Z',
        'Scheme': 'internet-facing',
        'CanonicalHostedZoneNameID': 'Z1M58G0W56PQJA'
      },
      'instance_count': 2,
      'results': []
    },
    {
      'group': {
        'Instances': null,
        'Subnets': [
          'subnet-0378a966',
          'subnet-eccedfaa'
        ],
        'DNSName': 'bastion-vpn-lb-1855726553.us-west-1.elb.amazonaws.com',
        'VPCId': 'vpc-79b1491c',
        'LoadBalancerName': 'bastion-vpn-lb',
        'CanonicalHostedZoneName': 'bastion-vpn-lb-1855726553.us-west-1.elb.amazonaws.com',
        'SourceSecurityGroup': {
          'GroupName': 'bastion-vpn-sg',
          'OwnerAlias': '933693344490'
        },
        'AvailabilityZones': [
          'us-west-1a',
          'us-west-1c'
        ],
        'HealthCheck': {
          'Target': 'TCP:1194',
          'Timeout': 5,
          'Interval': 30,
          'HealthyThreshold': 5,
          'UnhealthyThreshold': 2
        },
        'SecurityGroups': [
          'sg-7e9ef71b'
        ],
        'ListenerDescriptions': [
          {
            'Listener': {
              'Protocol': 'TCP',
              'InstancePort': 1194,
              'InstanceProtocol': 'TCP',
              'LoadBalancerPort': 1194,
              'SSLCertificateId': null
            },
            'PolicyNames': null
          }
        ],
        'CreatedTime': '2015-08-24T17:09:56.87Z',
        'Scheme': 'internet-facing',
        'CanonicalHostedZoneNameID': 'Z1M58G0W56PQJA'
      },
      'instance_count': 0,
      'results': []
    },
    {
      'group': {
        'Instances': [
          {
            'InstanceId': 'i-20f122e5'
          },
          {
            'InstanceId': 'i-39aae6fb'
          }
        ],
        'Subnets': [
          'subnet-0378a966',
          'subnet-eccedfaa'
        ],
        'DNSName': 'beavis-lb-1688730013.us-west-1.elb.amazonaws.com',
        'VPCId': 'vpc-79b1491c',
        'LoadBalancerName': 'beavis-lb',
        'CanonicalHostedZoneName': 'beavis-lb-1688730013.us-west-1.elb.amazonaws.com',
        'SourceSecurityGroup': {
          'GroupName': 'api-lb',
          'OwnerAlias': '933693344490'
        },
        'AvailabilityZones': [
          'us-west-1a',
          'us-west-1c'
        ],
        'HealthCheck': {
          'Target': 'HTTP:2020/health_check',
          'Timeout': 5,
          'Interval': 30,
          'HealthyThreshold': 10,
          'UnhealthyThreshold': 2
        },
        'SecurityGroups': [
          'sg-1227fa77',
          'sg-ac528bc9'
        ],
        'ListenerDescriptions': [
          {
            'Listener': {
              'Protocol': 'HTTPS',
              'InstancePort': 2020,
              'InstanceProtocol': 'HTTP',
              'LoadBalancerPort': 443,
              'SSLCertificateId': 'arn:aws:iam::933693344490:server-certificate/OpseeCoWildcard'
            },
            'PolicyNames': [
              'AWSConsole-SSLNegotiationPolicy-beavis-lb-1443046032320'
            ]
          }
        ],
        'CreatedTime': '2015-09-23T22:07:11.65Z',
        'Scheme': 'internet-facing',
        'CanonicalHostedZoneNameID': 'Z1M58G0W56PQJA'
      },
      'instance_count': 2,
      'results': []
    },
    {
      'group': {
        'Instances': [
          {
            'InstanceId': 'i-20f122e5'
          },
          {
            'InstanceId': 'i-38aae6fa'
          },
          {
            'InstanceId': 'i-39aae6fb'
          }
        ],
        'Subnets': [
          'subnet-0378a966',
          'subnet-eccedfaa'
        ],
        'DNSName': 'internal-c1-us-west-1-ssh-1605792065.us-west-1.elb.amazonaws.com',
        'VPCId': 'vpc-79b1491c',
        'LoadBalancerName': 'c1-us-west-1-ssh',
        'CanonicalHostedZoneName': '',
        'SourceSecurityGroup': {
          'GroupName': 'cluster1-ssh-lb',
          'OwnerAlias': '933693344490'
        },
        'AvailabilityZones': [
          'us-west-1a',
          'us-west-1c'
        ],
        'HealthCheck': {
          'Target': 'TCP:22',
          'Timeout': 3,
          'Interval': 5,
          'HealthyThreshold': 2,
          'UnhealthyThreshold': 2
        },
        'SecurityGroups': [
          'sg-52a42237'
        ],
        'ListenerDescriptions': [
          {
            'Listener': {
              'Protocol': 'TCP',
              'InstancePort': 22,
              'InstanceProtocol': 'TCP',
              'LoadBalancerPort': 9122,
              'SSLCertificateId': null
            },
            'PolicyNames': null
          }
        ],
        'CreatedTime': '2015-07-02T23:44:01.12Z',
        'Scheme': 'internal',
        'CanonicalHostedZoneNameID': 'Z1M58G0W56PQJA'
      },
      'instance_count': 3,
      'results': []
    }
  ]
};