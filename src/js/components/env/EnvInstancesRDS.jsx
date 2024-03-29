import React, {PropTypes} from 'react';
import {Col, Grid, Panel, Row} from '../layout';
import {Toolbar} from '../global';
import EnvList from './EnvList.jsx';

const EnvInstancesRDS = React.createClass({
  propTypes: {
    location: PropTypes.object
  },
  render() {
    return (
      <div>
        <Toolbar title="Environment - RDS DB Instances"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <Panel>
                  <EnvList include={['instances.rds']} limit={1000}/>
                </Panel>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});

export default EnvInstancesRDS;