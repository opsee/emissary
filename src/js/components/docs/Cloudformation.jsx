import React, {PropTypes} from 'react';
import {Button} from '../../modules/bootstrap';
import {Toolbar, HTMLFile} from '../global';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import CloudFormationTemplate from './CloudFormationTemplate.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Docs: Cloudformation"/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <div className="padding-tb">
                <h2>The Opsee Bastion Instance CloudFormation Template</h2>
                <HTMLFile path="/files/docs/cloudformation.html"/>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});