import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import {Toolbar} from '../global';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {Heading} from '../type';
import {Mail, Slack, Chat} from '../icons';

export default React.createClass({
  propTypes: {
    redux: PropTypes.shape({
      user: PropTypes.object
    })
  },
  renderAdminLinks(){
    if (this.props.redux.user.get('admin')){
      return (
        <Padding b={1} t={1}>
          <Heading level={3}>Onboarding Pages</Heading>
          <div><Link to="/start/launch-stack">Launch Stack</Link></div>
          <div><Link to="/start/password">Set Password</Link></div>
          <div><Link to="/start/choose-region">Region Select</Link></div>
          <div><Link to="/start/choose-vpc">VPC Scan + Select</Link></div>
          <div><Link to="/start/choose-subnet">Subnet Scan + Select</Link></div>
          <div><Link to="/start/install">Instance Installation</Link></div>
          <Padding t={2}>
            <Heading level={3}>Admin Pages</Heading>
            <div><Link to="/styleguide">Style Guide</Link></div>
          </Padding>
        </Padding>
      );
    }
    return null;
  },
  render() {
    return (
      <div>
        <Toolbar title="Documentation and Support"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Panel>
                <Padding b={3}>
                  <Heading level={3}>Documentation</Heading>
                  <ul>
                    <li><Link to="/docs/checks">Checks</Link></li>
                    <li><Link to="/docs/notifications">Notifications</Link></li>
                    <li><Link to="/docs/permissions">AWS Security &amp; Permissions</Link></li>
                    <li><Link to="/docs/instance">The Opsee EC2 Instance</Link></li>
                  </ul>
                </Padding>

                <Padding b={3}>
                  <Heading level={3}>Support</Heading>
                  <p>Get in touch with us any time with questions or feature requests:</p>
                  <ul>
                    <li><Mail fill="text" inline /> Email: <a href="mailto:support@opsee.com">support@opsee.com</a></li>
                    <li><Chat fill="text" inline /> IRC: <a href="irc://irc.freenode.org/opsee">#opsee on FreeNode</a></li>
                    <li><Slack fill="text" inline /> Slack: <a href="https://opsee-support.slack.com">opsee-support.slack.com</a></li>
                  </ul>
                </Padding>

                <Padding b={3}>
                  <Link to="/system">View System Information</Link>
                </Padding>
                {this.renderAdminLinks()}
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
