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
              <p>Checks determine the health of your services. Checks run every 30 seconds. Opsee looks for 4 consecutive events of the same state - we call this "stable state". You will receive a notification if the state of your check changes.</p>
              <Heading level={2}>Targets</Heading>
              <p>The following entities are available health check targets:</p>
              <Heading level={3}>EC2 Instance</Heading>
              <p>A single EC2 Instance of any size. For HTTP checks, our EC2 instance will communicate with the target directly and make a request. Instances can also be targeted through the <a target="_blank" href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/ec2-metricscollected.html">CloudWatch API</a>, and all standard EC2 instance metrics are available in Opsee.</p>
              <Heading level={3}>EC2 Security Group</Heading>
              <p>When a security group is selected, the check will run on all instances in the group. If instances are added and removed from the group, Opsee will automatically update the group definition, always running the check on the most up-to-date list of member instances. For HTTP checks, our EC2 instance will communicate with the target directly and make a request. Groups can also be targeted through the <a target="_blank" href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/ec2-metricscollected.html">CloudWatch API</a>, and all standard EC2 instance metrics are available in Opsee.</p>
              <Heading level={3}>EC2 Auto Scale Group (ASG)</Heading>
              <p>When an ASG is selected, the check will run on all instances in the group. If instances are added and removed from the group, Opsee will automatically update the group definition, always running the check on the most up-to-date list of member instances. For HTTP checks, our EC2 instance will communicate with the target directly and make a request. Groups can also be targeted through the <a target="_blank" href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/ec2-metricscollected.html">CloudWatch API</a>, and all standard EC2 instance metrics are available in Opsee.</p>
              <Heading level={3}>Elastic Load Balancer (ELB)</Heading>
              <p>When an ELB is set as a target, the check will run on all instances behind the load balancer. If instances are added and removed from the ELB definition, Opsee will automatically update the ELB definition, always running the check on the most up-to-date list of member instances. For HTTP checks, our EC2 instance will communicate with the target directly and make a request. ELBs can also be targeted through the <a target="_blank" href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/ec2-metricscollected.html">CloudWatch API</a>, and all standard EC2 instance metrics are available in Opsee.</p>
              <Heading level={3}>RDS DB Instance</Heading>
              <p>RDS database instances can be targeted for health checks through the <a target="_blank" href="http://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/rds-metricscollected.html">CloudWatch API</a>, and all standard metrics are available in Opsee. Enchanced RDS monitoring is not currently supported.</p>

              <Heading level={2}>HTTP Requests</Heading>
              <p>A HTTP/S check request is made to your chosen target. The request must contain the following information:</p>
              <ul>
                <li>Method (GET, POST, PUT, DELETE, or PATCH)</li>
                <li>Path (e.g. '/' or '/healthcheck')</li>
                <li>Port Number (e.g. 80)</li>
                <li>(optional) Header Key & Value (e.g. 'Content-Type' : 'application/json')</li>
              </ul>
              <Heading level={2}>Assertions</Heading>
              <p>Assertions allow you to define what is considered a valid response.</p>
              <p>You can make assertions against:</p>
              <ul>
                <li>Status Code (HTTP checks)</li>
                <li>Headers (HTTP checks)</li>
                <li>Response Body (HTTP checks) - if the Content-Type header contains 'json' then you can make assertions against individual keys and values in the response body. Otherwise, assertions on the complete body contents are available</li>
                <li>Metrics (all checks) - depending on the type of check being created, different metrics will be available</li>
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