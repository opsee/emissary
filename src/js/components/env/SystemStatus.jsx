import React from 'react';

import {Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {OnboardActions} from '../../actions';
import {OnboardStore} from '../../stores';

const SystemStatus = React.createClass({
  mixins: [OnboardStore.mixin],
  getInitialState(){
    return {
      bastions: undefined
    };
  },
  componentWillMount(){
    OnboardActions.getBastions();
  },
  storeDidChange(){
    if (OnboardStore.getGetBastionsStatus() === 'success'){
      this.setState({
        bastions: OnboardStore.getBastions() || []
      });
    }
  },
  getConnectedBastions(){
    return this.state.bastions.length;
  },
  renderBastionsInfo(){
    if (this.state.bastions){
      return (
        <div>
          Connected Bastions: {this.getConnectedBastions()}
        </div>
      );
    }
    return <div/>;
  },
  render() {
    return (
      <div>
        <Toolbar title="System Status"/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderBastionsInfo()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default SystemStatus;