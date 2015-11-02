import React, {PropTypes} from 'react';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import {PageAuth} from '../../modules/statics';
import EnvWithFilter from './EnvWithFilter.jsx';
import _ from 'lodash';

export default React.createClass({
  statics: {
    willTransitionTo: PageAuth
  },
  propTypes: {
    query: PropTypes.object
  },
  render() {
    return (
      <div>
        <Toolbar title="Environment - EC2 Instances"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <EnvWithFilter include={['instancesECC']} filter={_.get(this.props.query, 'filter')} limit={1000}/>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});
