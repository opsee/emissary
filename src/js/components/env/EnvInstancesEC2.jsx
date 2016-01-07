import React, {PropTypes} from 'react';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import EnvList from './EnvList.jsx';
import _ from 'lodash';

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
                <EnvList include={['instancesECC']} filter={_.get(this.props.location.query, 'filter')} limit={1000}/>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});

export default EnvInstancesEC2;