import React, {PropTypes} from 'react';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import EnvList from './EnvList.jsx';
import _ from 'lodash';

const EnvGroupsELB = React.createClass({
  propTypes: {
    location: PropTypes.object,
    redux: PropTypes.object.isRequired
  },
  render() {
    return (
      <div>
        <Toolbar title="Environment - ELB Groups"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <EnvList include={['groupsELB']} filter={_.get(this.props.location.query, 'filter')} limit={1000} redux={this.props.redux}/>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});

export default EnvGroupsELB;