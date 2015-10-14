import React, {PropTypes} from 'react';
import {Button} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Other Pages"/>
        <Grid>
          <Row>
            <Col xs={12}>
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
                <li><Link to="docs">Docs</Link></li>
              </ul>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});
