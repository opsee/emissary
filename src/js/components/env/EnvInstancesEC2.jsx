import React, {PropTypes} from 'react';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Authenticator, Toolbar} from '../global';
import EnvList from './EnvList.jsx';

const EnvInstancesEC2 = React.createClass({
  propTypes: {
    location: PropTypes.object
  },
  render() {
    return (
      <Authenticator>
        <Toolbar title="Environment - EC2 Instances"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <EnvList include={['instances.ecc']} limit={1000}/>
              </Col>
            </Row>
          </Grid>
      </Authenticator>
    );
  }
});

export default EnvInstancesEC2;