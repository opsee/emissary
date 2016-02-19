import React, {PropTypes} from 'react';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Authenticator, Toolbar} from '../global';
import EnvList from './EnvList.jsx';

const EnvGroupsSecurity = React.createClass({
  propTypes: {
    location: PropTypes.object,
    redux: PropTypes.object.isRequired
  },
  render() {
    return (
      <Authenticator>
        <Toolbar title="Environment - Security Groups"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <EnvList include={['groups.security']} limit={1000} redux={this.props.redux}/>
              </Col>
            </Row>
          </Grid>
      </Authenticator>
    );
  }
});

export default EnvGroupsSecurity;