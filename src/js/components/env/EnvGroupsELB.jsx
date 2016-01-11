import React, {PropTypes} from 'react';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import EnvList from './EnvList.jsx';

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
                <EnvList include={['groupsELB']} limit={1000} redux={this.props.redux}/>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});

export default EnvGroupsELB;