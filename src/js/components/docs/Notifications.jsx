import React from 'react';

import {Toolbar, Highlight} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Heading} from '../type';
import {Padding} from '../layout';
import {SlackConnect, SlackInfo} from '../integrations';

const Notifications = React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: Notifications"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <p>If a health check fails, Opsee can send one or more notifications via:</p>
              <ul>
                <li>Email</li>
                <li>A Slack channel</li>
                <li>A Webhook</li>
              </ul>
              <Heading level={2}>Email</Heading>
              <p>Speak to your IT professional if you&rsquo;ve never used email before.</p>
              <Heading level={2}>Slack Channels</Heading>
              <p>First, <SlackConnect target="_blank"/>.</p>
              <p>When successfully connected, you&rsquo;ll see a list of Slack channels available to you as notification options during check creation.</p>
              <Padding b={1}>
                <SlackInfo/>
              </Padding>
              <Heading level={2}>Webhooks</Heading>
              <p>Here is what an Opsee webhook looks like:</p>
              <Padding tb={1}>
                <Highlight>
                {JSON.stringify({
                  'check_id': '00002',
                  'check_name': 'Test Check',
                  'passing': true,
                  'responses': [
                    {
                      'passing': true,
                      'response': {
                        'body': 'test',
                        'code': 200,
                        'host': 'a host'
                      },
                      'target': {
                        'id': 'test-target'
                      }
                    }
                  ],
                  'target': {
                    'id': 'Test Target'
                  },
                  'version': 1
                }, null, ' ')}
                </Highlight>
              </Padding>
              <Padding t={1}>
                <p>Important details about our webhooks:</p>
                <ul>
                  <li>When a Check is failing, you will see <code>'passing': false</code> at the top level.<br/><code>'passing': true</code> is sent when an alert is resolved.</li>
                  <li>You will only receive one webhook per event. We currently do not support re-sending the request when the webhook returns an error.</li>
                  <li>Each response in the <code>responses</code> array will include a <code>passing</code> key that relates to that particular response.</li>
                  <li>If any response is failing, the check is deemed failing.</li>
                </ul>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Notifications;