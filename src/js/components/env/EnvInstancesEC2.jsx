import React, {PropTypes} from 'react';
import {Col, Grid, Panel, Row} from '../layout';
import {Toolbar} from '../global';
import EnvList from './EnvList.jsx';

const EnvInstancesEC2 = React.createClass({
  propTypes: {
    location: PropTypes.object
  },
  render() {
    return (
      <div>
        <Toolbar title="Environment - EC2 Instances"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <Panel>
                  <EnvList include={['instances.ecc']} limit={1000}/>
                </Panel>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});

export default EnvInstancesEC2;