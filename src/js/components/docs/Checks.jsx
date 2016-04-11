import React from 'react';
import {Link} from 'react-router';
import {Highlight, Toolbar} from '../global';
import {Col, Grid, Row} from '../layout';
import {Heading} from '../type';

const Checks = React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: Checks"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <p>Checks determine the Health of your services. Checks have four main components - a target, a request, assertions, and notifications.</p>
              <p>Checks run every 30 seconds. Opsee looks for 4 consecutive events of the same state - we call this "stable state". You will receive a notification if the state of your check changes.</p>
              <Heading level={2}>Targets</Heading>
              <p>The following entities are available health check targets:</p>
              <Heading level={3}>EC2 Instance</Heading>
              <p>A single EC2 Instance of any size.</p>
              <Heading level={3}>EC2 Security Group</Heading>
              <p>When a security group is selected, the check will run on all instances in the group. If instances are added and removed from the group, Opsee will automatically update the group definition, always running the check on the most up-to-date list of member instances</p>
              <Heading level={3}>Elastic Load Balancer (ELB)</Heading>
              <p>When an ELB is set as a target, the check will run on all instances behind the load balancer. If instances are added and removed from the ELB definition, Opsee will automatically update the ELB definition, always running the check on the most up-to-date list of member instances</p>
              <Heading level={2}>Requests</Heading>
              <p>A HTTP/S request is made to your chosen target. The request must contain the following information:</p>
              <ul>
                <li>Method (GET, POST, PUT, DELETE, or PATCH)</li>
                <li>Path (e.g. '/' or '/healthcheck')</li>
                <li>Port Number (e.g. 80)</li>
                <li>(optional) Header Key & Value (e.g. 'content-type' : 'application/json')</li>
              </ul>
              <Heading level={2}>Assertions</Heading>
              <p>The bread and butter of a check, assertions allow you to define what is considered a valid response.</p>
              <p>The three areas in which you can make HTTP/S assertions against are:</p>
              <ul>
                <li>Status Code</li>
                <li>Headers</li>
                <li>Response Body</li>
              </ul>
              <p>A simple <em>response ok</em> assertion looks like this:</p>
              <Highlight>
                {JSON.stringify({key: 'code', relationship: 'equal', operand: '200'}, null, ' ')}
              </Highlight>
              <br/>
              <p>Use any combination of assertions that helps you feel secure about your responses.</p>
              <Heading level={3} id="json">JSON Responses</Heading>
              <p>If your service responds in valid JSON format including a correct <code>Content-Type</code> header, you can take advantage of our powerful JSON path parameter. Here&rsquo;s how it works:</p>
              <ul>
                <li>The response body will be converted to a JavaScript object using <code>JSON.stringify</code>.</li>
                <li>You supply a JSON "path" that is written with standard <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_Accessors" target="_blank">property accessors</a>.</li>
                <li>We use the <a href="https://lodash.com/docs#get" target="_blank"><code>.get()</code> function in Lodash</a> to safely select an object.</li>
                <li>If your response is valid json and an object is found, you can make any assertion against it.</li>
              </ul>
              <p>Now you can ensure that the first dog is older than 3:</p>
              <Highlight>
                {JSON.stringify({key: 'json', relationship: 'greaterThan', value: 'animals.dogs[0].age', operand: '3'}, null, ' ')}
              </Highlight>
              <br/>
              <p>At least one assertion is required per check.</p>
              <Heading level={2}>Notifications</Heading>
              <p><Link to="/docs/notifications">Learn more about notifications here</Link></p>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Checks;