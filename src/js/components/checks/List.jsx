import React from 'react';
import {CheckActions} from '../../actions';
import {Toolbar, StatusHandler} from '../global';
import {CheckStore} from '../../stores';
import {Link} from 'react-router';
import {Add} from '../icons';
import {PageAuth} from '../../modules/statics';
import {Grid, Row, Col} from '../../modules/bootstrap';
import CheckItemList from './CheckItemList.jsx';
import {Button} from '../forms';

function getState(){
  return {
    checks: CheckStore.getChecks(),
    status: CheckStore.getGetChecksStatus()
  };
}

export default React.createClass({
  mixins: [CheckStore.mixin],
  statics: {
    willTransitionTo: PageAuth
  },
  getInitialState(){
    return getState();
  },
  componentWillMount(){
    this.getData();
  },
  storeDidChange() {
    let state = getState();
    if (state.status && state.status !== 'success' && state.status !== 'pending'){
      state.error = state.status;
    }
    if (CheckStore.getDeleteCheckStatus() === 'success'){
      this.getData();
    }
    this.setState(state);
  },
  getData(){
    CheckActions.getChecks();
  },
  renderChecks(){
    if (this.state.checks.size){
      return (
        <div>
          <h3>All Checks ({this.state.checks.size})</h3>
          <CheckItemList checks={this.state.checks}/>
        </div>
      );
    }
    return (
      <StatusHandler status={this.state.status}>
        <p>You don't have any Checks yet. <Link to="checkCreate" title="Create New Check">Create Your First Check</Link> to get started with Opsee.</p>

        <p>Try creating a check like this to start:</p>
        <ol>
          <li>Target a Group or Instance running a <strong>HTTP service</strong></li>
          <li>Make a request to the URL and port running that service (e.g. <strong>"/healthcheck"</strong> on <strong>Port 80</strong>)</li>
          <li>Assert that the <strong>Status Code</strong> must come back <strong>Equal to 200</strong></li>
          <li>Send <strong>notifications to your email</strong> when the Check fails</li>
        </ol>
      </StatusHandler>
    );
  },
  render() {
    return (
      <div>
        <Toolbar title="Checks">
          <Button color="primary" fab to="checkCreate" title="Create New Check">
            <Add btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderChecks()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});