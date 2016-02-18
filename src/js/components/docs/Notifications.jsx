import React from 'react';
// import {Link} from 'react-router';
import {Toolbar, Highlight} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Heading} from '../type';
import {Padding} from '../layout';
import slackProfileImage from '../../../img/docs/notifications/slack-profile.png';
import slackCheckImage from '../../../img/docs/notifications/slack-notification.png';
import whNotificationImage from '../../../img/docs/notifications/webhook-notification.png';

const Notifications = React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: Notifications"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Heading level={2}>General Information About Notifications in Opsee</Heading>
              <p>If a health check fails, Opsee can send notifications to:</p>
              <ul>
                <li>Email</li>
                <li>Slack channels</li>
                <li>Webhooks</li>
              </ul>

              <Heading level={2}>Email Notifications</Heading>
              <p>Speak to your IT professional if you've never used email before.</p>

              <Heading level={2}>Slack Notifications</Heading>
              <p>First, you need to connect your Opsee account to Slack. You can do this one of two ways. First, you can go to your <a href="/profile">Profile page</a> to connect:</p>
              <Padding b={2}>
                <img src={slackProfileImage} alt="connect Slack on the profile page"/>
              </Padding>

              <p>Or you can simply <a href="/check-create/target">create a check</a>. In the last step, when trying to add a Slack notification, we'll prompt you to connect Slack if you haven't already.</p>
              <Padding b={2}>
                <img src={slackCheckImage} alt="connect Slack during check creation"/>
              </Padding>

              <Heading level={2}>Webhook Notifications</Heading>
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

              <p>Some other important things to know about our webhooks:</p>
              <ul>
                <li>When a Check is failing, you will see <code>'passing': false</code> at the top level. <code>'passing': true</code> is sent when an alert is resolved</li>
                <li>You will only receive one webhook per event, and we currently do not support re-sending webhooks when the recipient returns an error</li>
                <li>Each response in the responses array will have an indicator saying whether or not that individual response is passing or failing like the top-level passing value</li>
                <li>If any response is failing, the whole event will be failing</li>
              </ul>

              <p>To add a webhook notification to your check, just enter the URL in the last step of check creation:</p>
              <Padding b={2}>
                <img src={whNotificationImage} alt="add a webhook notification"/>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Notifications;