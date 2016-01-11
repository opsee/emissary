import React, {PropTypes} from 'react';
import {Grid, Row, Col} from '../../modules/bootstrap';
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
                <EnvList include={['instancesECC']} limit={1000}/>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});

export default EnvInstancesEC2;