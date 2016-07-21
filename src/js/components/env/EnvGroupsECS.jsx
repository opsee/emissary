import React, {PropTypes} from 'react';
import {Col, Grid, Panel, Row} from '../layout';
import {Toolbar} from '../global';
import EnvList from './EnvList.jsx';

const EnvGroupsECS = React.createClass({
  propTypes: {
    location: PropTypes.object,
    redux: PropTypes.object.isRequired
  },
  render() {
    return (
      <div>
        <Toolbar title="Environment - EC2 Container Services"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <Panel>
                  <EnvList include={['groups.ecs']} limit={1000} redux={this.props.redux}/>
                </Panel>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});

export default EnvGroupsECS;