import React from 'react';

import {StatusHandler, Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {OnboardActions} from '../../actions';
import {OnboardStore} from '../../stores';
import {PageAuth} from '../../modules/statics';
import {Padding} from '../layout';
import config from '../../modules/config';

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
    let state = {};
    if (OnboardStore.getGetBastionsStatus() === 'success'){
      state.bastions = OnboardStore.getBastions() || [];
    }
    if (OnboardStore.getGetCustomerStatus() === 'success'){
      state.customer = OnboardStore.getCustomer();
    }
    this.setState(state);
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
              return <li key={`bastion-${bastion}`}>EC2 Instance ID: {bastion}</li>;
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
  renderCustomerInfo(){
    if (this.state.customer){
      return (
        <Padding t={3}>
          <div><strong>Customer ID:</strong>&nbsp;<span className="text-secondary">{this.state.customer.id}</span></div>
        </Padding>
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
              {this.renderCustomerInfo()}
              <strong>App Revision:</strong>&nbsp;<span className="text-secondary">{config.revision}</span>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default SystemStatus;