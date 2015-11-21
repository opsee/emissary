import React from 'react';
import {Toolbar} from '../global';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Opsee Documentation"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <ul>
                <li><Link to="/docs/bastion">The Bastion Instance</Link></li>
                <li><Link to="/docs/cloudformation">Our Cloudformation Template and Permissions</Link></li>
                <li><Link to="/docs/IAM">IAM Profile for Bastion Installation</Link></li>
              </ul>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});
