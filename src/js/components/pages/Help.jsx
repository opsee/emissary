import React, {PropTypes} from 'react';
import {Button} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
import colors from 'seedling/colors';
import {Mail, Slack, Docs, Chat} from '../icons';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Documentation and Support"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={1}>
              <h3>Documentation</h3>
              <ul className="list-unstyled">
                <li><Link to="docsBastion">The Bastion Instance</Link></li>
                <li><Link to="docsCloudformation">Our Cloudformation Template and Permissions</Link></li>
                <li><Link to="docsIAM">IAM Profile for Bastion Installation</Link></li>
              </ul>
              </Padding>

              <Padding b={1}>
                <h3>Support</h3>
                <p>Get in touch with us any time with questions or feature requests:</p>

                <p><span className="text-secondary"><Mail fill={colors.textColorSecondary} inline={true} /> Email:</span> <a href="mailto:support@opsee.com">support@opsee.com</a></p>

                <p><span className="text-secondary"><Chat fill={colors.textColorSecondary} inline={true} /> IRC:</span> <a href="irc://irc.freenode.org/opsee">#opsee on FreeNode</a></p>

                <p><span className="text-secondary"><Slack fill={colors.textColorSecondary} inline={true} /> Slack:</span> <a href="https://opsee-support.slack.com">opsee-support.slack.com</a></p>
              </Padding>

              <Padding b={1}>
                <h3>Admin Pages (Hide these!)</h3>
                <ul className="list-unstyled">
                  <li><Link to="tutorial">Tutorial</Link></li>
                  <li><Link to="onboardPassword">Set Password</Link></li>
                  <li><Link to="onboardTeam">Create Team</Link></li>
                  <li><Link to="onboardRegionSelect">Region Select</Link></li>
                  <li><Link to="onboardCredentials">Credentials</Link></li>
                  <li><Link to="onboardVpcSelect">VPC Scan + Select</Link></li>
                  <li><Link to="onboardInstall">Bastion Installation</Link></li>
                  <li><Link to="adminSignups">Admin: Signups</Link></li>
                  <li><Link to="systemStatus">System Status</Link></li>
                  <li><Link to="styleguide">Style Guide</Link></li>
                </ul>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
