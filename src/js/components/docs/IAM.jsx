import React, {PropTypes} from 'react';
import {Button} from '../../modules/bootstrap';
import {Toolbar, HTMLFile} from '../global';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: IAM Profile for Bastion Installation"/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <HTMLFile path="/files/docs/iam.html"/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
