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
        <Toolbar title="More"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={1}>
              <h3>Other Pages</h3>
              <ul className="list-unstyled">
                <li><Link to="docs"><Docs fill={colors.primary} inline={true}/> Docs</Link></li>
              </ul>
              </Padding>

              <Padding b={1}><hr/></Padding>

              <Padding b={1}>
                <h3>Help and Support</h3>
                <p>Get in touch with us any time with questions or feature requests:</p>

                <table className="table">
                  <tbody>
                  <tr>
                    <td><Mail inline={true} /> Email</td>
                    <td><a href="mailto:support@opsee.com">support@opsee.com</a></td>
                  </tr>
                  <tr>
                    <td><Chat inline={true} /> IRC</td>
                    <td><a href="irc://irc.freenode.org/opsee">#opsee on FreeNode</a></td>
                  </tr>
                  <tr>
                    <td><Slack inline={true} /> Slack</td>
                    <td><a href="https://opsee-support.slack.com">opsee-support.slack.com</a></td>
                  </tr>
                  </tbody>
                </table>
              </Padding>

              <Padding b={1}>
                <h3>Admin Pages (Hide these!)</h3>
                <ul>
                  <li><Link to="tutorial">Tutorial</Link></li>
                  <li><Link to="onboardPassword">Set Password</Link></li>
                  <li><Link to="onboardTeam">Create Team</Link></li>
                  <li><Link to="onboardRegionSelect">Region Select</Link></li>
                  <li><Link to="onboardCredentials">Credentials</Link></li>
                  <li><Link to="onboardVpcSelect">VPC Scan + Select</Link></li>
                  <li><Link to="onboardInstall">Bastion Installation</Link></li>
                  <li><Link to="adminSignups">Admin: Signups</Link></li>
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
