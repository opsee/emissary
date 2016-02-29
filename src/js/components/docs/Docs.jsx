import React from 'react';
import {Toolbar} from '../global';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';

const Docs = React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Opsee Documentation"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <ul>
                <li><Link to="/docs/bastion">The Bastion Instance</Link></li>
                <li><Link to="/docs/IAM">IAM Profile for Bastion Installation</Link></li>
              </ul>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});

export default Docs;
