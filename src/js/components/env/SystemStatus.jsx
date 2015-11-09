import React from 'react';

import {StatusHandler, Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {OnboardActions} from '../../actions';
import {OnboardStore} from '../../stores';
import {PageAuth} from '../../modules/statics';

const SystemStatus = React.createClass({
  mixins: [OnboardStore.mixin],
  statics: {
    willTransitionTo: PageAuth
  },
  getInitialState(){
    return {
      bastions: undefined
    };
  },
  componentWillMount(){
    OnboardActions.getBastions();
    OnboardActions.getCustomer();
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
  renderBastionList(){
    if (this.state.bastions.length){
      return (
        <div>
          <h3>Connected Bastions</h3>
          <ul>
            {this.state.bastions.map(bastion => {
              return <li>EC2 Instance ID: {bastion}</li>;
            })}
          </ul>
        </div>
      );
    }
    return <h3>No Connected Bastions.</h3>;
  },
  renderBastionsInfo(){
    if (this.state.bastions){
      return this.renderBastionList();
    }
    return <StatusHandler status={OnboardStore.getGetBastionsStatus()}/>;
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