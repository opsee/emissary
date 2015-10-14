import React, {PropTypes} from 'react';
import {Button} from '../../modules/bootstrap';
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
                <li><Link to="docsBastion">The Bastion Instance</Link></li>
                <li><Link to="docsCloudformation">Our Cloudformation Template and Permissions</Link></li>
                <li><Link to="docsIAM">IAM Profile for Bastion Installation</Link></li>
              </ul>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});
