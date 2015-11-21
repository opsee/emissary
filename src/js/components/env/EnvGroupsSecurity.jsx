import React, {PropTypes} from 'react';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import EnvWithFilter from './EnvWithFilter.jsx';
import _ from 'lodash';

export default React.createClass({
  propTypes: {
    location: PropTypes.object
  },
  render() {
    return (
      <div>
        <Toolbar title="Environment - Security Groups"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <EnvWithFilter include={['groupsSecurity']} filter={_.get(this.props.location.query, 'filter')} limit={1000}/>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});
