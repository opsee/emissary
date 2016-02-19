import React, {PropTypes} from 'react';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Authenticator, Toolbar} from '../global';
import EnvList from './EnvList.jsx';

const EnvGroupsELB = React.createClass({
  propTypes: {
    location: PropTypes.object,
    redux: PropTypes.object.isRequired
  },
  render() {
    return (
      <Authenticator>
        <Toolbar title="Environment - ELB Groups"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <EnvList include={['groups.elb']} limit={1000} redux={this.props.redux}/>
              </Col>
            </Row>
          </Grid>
      </Authenticator>
    );
  }
});

export default EnvGroupsELB;