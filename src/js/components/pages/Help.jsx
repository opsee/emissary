import React from 'react';
import {Toolbar} from '../global';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import {Mail, Slack, Chat} from '../icons';
import {UserStore} from '../../stores';

export default React.createClass({
  renderAdminLinks(){
    if (UserStore.getUser().get('admin')){
      return (
        <Padding b={1}>
          <h3>Onboarding Pages</h3>
          <div><Link to="/start/tutorial">Tutorial</Link></div>
          <div><Link to="/start/password">Set Password</Link></div>
          <div><Link to="/start/region-select">Region Select</Link></div>
          <div><Link to="/start/credentials">Credentials</Link></div>
          <div><Link to="/start/vpc-select">VPC Scan + Select</Link></div>
          <div><Link to="/start/install">Bastion Installation</Link></div>
          {
          //<div><Link to="/onboardTeam">Create Team</Link></div>
          }
          <h3>Admin Pages</h3>
          <div><Link to="/admin/signups">Admin: Signups</Link></div>
          <div><Link to="/system">System</Link></div>
          <div><Link to="/styleguide">Style Guide</Link></div>
        </Padding>
      );
    }
    return <div/>;
  },
  render() {
    return (
      <div>
        <Toolbar title="Documentation and Support"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={1}>
              <h3>Documentation</h3>
              <ul>
                <li><Link to="/docs/checks">Check Types and Targets</Link></li>
                <li><Link to="/docs/bastion">The Bastion Instance</Link></li>
                <li><Link to="/docs/cloudformation">Our Cloudformation Template and Permissions</Link></li>
                <li><Link to="/docs/IAM">IAM Profile for Bastion Installation</Link></li>
              </ul>
              </Padding>

              <Padding b={1}>
                <h3>Support</h3>
                <p>Get in touch with us any time with questions or feature requests:</p>
                <ul>
                  <li><Mail fill="text" inline /> Email: <a href="mailto:support@opsee.com">support@opsee.com</a></li>
                  <li><Chat fill="text" inline /> IRC: <a href="irc://irc.freenode.org/opsee">#opsee on FreeNode</a></li>
                  <li><Slack fill="text" inline /> Slack: <a href="https://opsee-support.slack.com">opsee-support.slack.com</a></li>
                </ul>

              </Padding>
              {this.renderAdminLinks()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
