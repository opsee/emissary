import React, {PropTypes} from 'react';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Toolbar} from '../global';
import EnvList from './EnvList.jsx';
import _ from 'lodash';

const EnvGroupsSecurity = React.createClass({
  propTypes: {
    location: PropTypes.object,
    redux: PropTypes.object.isRequired
  },
  render() {
    return (
      <div>
        <Toolbar title="Environment - Security Groups"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <EnvList include={['groupsSecurity']} filter={_.get(this.props.location.query, 'filter')} limit={1000} redux={this.props.redux}/>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});

export default EnvGroupsSecurity;