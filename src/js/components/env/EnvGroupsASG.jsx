import React, {PropTypes} from 'react';
import {Col, Grid, Panel, Row} from '../layout';
import {Toolbar} from '../global';
import EnvList from './EnvList.jsx';

const EnvGroupsASG = React.createClass({
  propTypes: {
    location: PropTypes.object,
    redux: PropTypes.object.isRequired
  },
  render() {
    return (
      <div>
        <Toolbar title="Environment - Auto Scaling Groups"/>
          <Grid>
            <Row>
              <Col xs={12}>
                <Panel>
                  <EnvList include={['groups.asg']} limit={1000} redux={this.props.redux}/>
                </Panel>
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
});

export default EnvGroupsASG;