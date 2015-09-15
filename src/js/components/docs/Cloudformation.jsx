import React, {PropTypes} from 'react';
import {Button} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: Cloudformation"/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <ul>
                <li><Link to="start">Signup</Link></li>
              </ul>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});
