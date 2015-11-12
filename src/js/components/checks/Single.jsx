import React, {PropTypes} from 'react';
import _ from 'lodash';
import {List} from 'immutable';

import {CheckActions, GroupActions} from '../../actions';
import {Toolbar, StatusHandler} from '../global';
import {GroupItem} from '../groups';
import {CheckStore, GroupStore} from '../../stores';
import {Edit, Delete, Mail} from '../icons';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {PageAuth} from '../../modules/statics';
import {Button} from '../forms';
import router from '../../modules/router.js';
import {Padding} from '../layout';
import AssertionItemList from './AssertionItemList';
import CheckResponse from './CheckResponse';

function getState(){
  return {
    check: CheckStore.getCheck(),
    status: CheckStore.getGetCheckStatus(),
    sgStatus: GroupStore.getGetGroupSecurityStatus(),
    elbStatus: GroupStore.getGetGroupELBStatus(),
    group: GroupStore.getNewGroup(),
    responseStatus: CheckStore.getTestCheckStatus()
  };
}

export default React.createClass({
  mixins: [CheckStore.mixin, GroupStore.mixin],
  statics: {
    willTransitionTo: PageAuth
  },
  propTypes: {
    params: PropTypes.object
  },
  componentWillMount(){
    this.getData();
  },
  getInitialState(){
    return _.assign(getState(), {
      response: null,
      results: null
    });
  },
  storeDidChange() {
    let state = getState();
    if (CheckStore.getDeleteCheckStatus() === 'success'){
      router.transitionTo('checks');
    }
    if (state.status === 'success'){
      const target = state.check.get('target');
      if (target){
        switch (target.type){
        case 'sg':
          GroupActions.getGroupSecurity(target.id);
          break;
        case 'elb':
          GroupActions.getGroupELB(target.id);
          break;
        default:
          break;
        }
      }
    }
    if (state.sgStatus === 'success' || state.elbStatus === 'success'){
      state.group = GroupStore.getGroup(this.state.check.get('target'));
      state.results = state.group.get('results');
    }
    if (state.responseStatus === 'success'){
      state.response = CheckStore.getResponse();
    }
    this.setState(state);
  },
  getData(){
    CheckActions.getCheck(this.props.params.id);
  },
  getCheckJS(){
    return this.state.check.toJS();
  },
  getTarget(){
    GroupStore.getGroupFromFilter();
  },
  getLink(){
    const group = this.state.group.toJS();
    return (
      <span>{group.name || group.id}</span>
    );
  },
  getResponses(){
    if (this.state.results && this.state.results.size){
      const results = this.state.results.toJS();
      const failing = _.filter(results, r => {
        return !r.passing;
      });
      return failing.length ? new List(failing[0].responses) : new List(results[0].responses);
    }
    return new List();
  },
  getSingleResponse(){
    const data = this.getResponses();
    let val;
    if (data){
      let response = this.getResponses().toJS();
      if (response && response.length){
        val = _.get(response[0], 'response.value');
      }
    }
    return val;
  },
  runRemoveCheck(){
    CheckActions.deleteCheck(this.props.params.id);
  },
  renderInner(){
    const spec = this.getCheckJS().check_spec.value;
    if (!this.state.error && this.state.check.get('id')){
      return (
        <div>
          <Padding b={1}>
            <h3>Target</h3>
            <GroupItem item={this.state.group}/>
          </Padding>
          <Padding b={1}>
            <h3>HTTP Request</h3>
            <Alert bsStyle="default" style={{wordBreak: 'break-all'}}>
              <strong>{spec.verb}</strong> http://{this.getLink()}:<span>{spec.port}</span>{spec.path}
            </Alert>
          </Padding>
          <Padding b={1}>
            <h3>Assertions</h3>
            <AssertionItemList assertions={this.state.check.get('assertions')} response={this.getSingleResponse()}/>
          </Padding>
          <Padding b={1}>
            <h3>Response</h3>
            <CheckResponse response={this.getResponses()}/>
          </Padding>
          <Padding b={1}>
            <h3>Notifications</h3>
            <ul className="list-unstyled">
            {this.state.check.get('notifications').map((n, i) => {
              return (
                <li key={`notif-${i}`}><Mail fill="text" inline/> {n.value}</li>
              );
            })}
            </ul>
          </Padding>
        </div>
      );
    }
    return (
      <StatusHandler status={this.state.status}>
        <h3>No Checks Applied</h3>
      </StatusHandler>
    );
  },
  renderLink(){
    if (this.state.check && this.state.check.get('id')){
      return (
        <Button to="checkEdit" params={{id: this.props.params.id}} color="info" fab title={`Edit ${this.state.check.name}`}>
          <Edit btn/>
        </Button>
      );
    }
    return <span/>;
  },
  render() {
    return (
      <div>
        <Toolbar title={`${this.state.check.name || ''}`}>
          {this.renderLink()}
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={3}>
                {this.renderInner()}
              </Padding>
              <Button onClick={this.runRemoveCheck} flat color="danger">
                <Delete inline fill="danger"/> Delete Check
              </Button>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});