import React, {PropTypes} from 'react';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import EnvWithFilter from './EnvWithFilter.jsx';
import _ from 'lodash';

const EnvGroupsELB = React.createClass({
  propTypes: {
    location: PropTypes.object
  },
  render() {
    return (
      <div>
        <Toolbar title="Environment - ELB Groups"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <EnvWithFilter include={['groupsELB']} filter={_.get(this.props.location.query, 'filter')} limit={1000}/>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});

export default EnvGroupsELB;