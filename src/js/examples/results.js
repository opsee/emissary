export {
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
              'code': 500,
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
};