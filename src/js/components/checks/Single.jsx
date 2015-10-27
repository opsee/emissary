import React, {PropTypes} from 'react';
import {CheckActions, GroupActions} from '../../actions';
import {Table, Toolbar, StatusHandler} from '../global';
import {GroupItem} from '../groups';
import {InstanceItem} from '../instances';
import {CheckStore, GroupStore} from '../../stores';
import {Link} from 'react-router';
import {Edit, Delete, Mail} from '../icons';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import AssertionCounter from './AssertionCounter.jsx';
import {PageAuth} from '../../modules/statics';
import {Button} from '../forms';
import router from '../../modules/router.js';
import {Padding} from '../layout';
import AssertionItemList from './AssertionItemList.jsx';
import colors from '../global/colors.css';

function getState(){
  return {
    check: CheckStore.getCheck(),
    status: CheckStore.getGetCheckStatus(),
    delStatus: CheckStore.getDeleteCheckStatus(),
    sgStatus: GroupStore.getGetGroupSecurityStatus(),
    elbStatus: GroupStore.getGetGroupELBStatus(),
    group: GroupStore.getNewGroup(),
    responseStatus: CheckStore.getTestCheckStatus()
  }
}

export default React.createClass({
  mixins: [CheckStore.mixin, GroupStore.mixin],
  statics: {
    willTransitionTo: PageAuth
  },
  storeDidChange() {
    let state = getState();
    if (state.delStatus == 'success'){
      router.transitionTo('checks');
    }
    if (state.status == 'success'){
      const target = state.check.get('target');
      if (target){
        switch(target.type){
          case 'sg':
            GroupActions.getGroupSecurity(target.id);
          break;
          case 'elb':
            GroupActions.getGroupELB(target.id);
          break;
        }
      }
    }
    if (state.sgStatus == 'success' || state.elbStatus == 'success'){
      state.group = GroupStore.getGroup(this.state.check.get('target'));
    }
    if (state.responseStatus == 'success'){
      state.response = CheckStore.getResponse();
    }
    this.setState(state);
  },
  getInitialState(){
    return _.assign(getState(), {
      response: null
    })
  },
  getData(){
    CheckActions.getCheck(this.props.params.id);
  },
  componentWillMount(){
    this.getData();
  },
  silence(id){
    CheckActions.silence(id);
  },
  getCheckJS(){
    return this.state.check.toJS();
  },
  removeCheck(){
    CheckActions.deleteCheck(this.props.params.id);
  },
  getTarget(){
    GroupStore.getGroupFromFilter()
  },
  getLink(){
    const target = this.state.check.get('target');
    const group = this.state.group.toJS();
    if (target.type == 'sg'){
      return (
        <span>{group.name || group.id}</span>
      )
    }else{
      //elb
      return (
        <span>{group.name || group.id}</span>
      )
    }
  },
  innerRender(){
    const spec = this.getCheckJS().check_spec.value;
    if (!this.state.error && this.state.check.get('id')){
      return (
        <div>
          <Padding b={1}>
            <h3>HTTP Request</h3>
            <Alert bsStyle="default">
              <strong>{spec.verb}</strong> http://{this.getLink()}:<span>{spec.port}</span>{spec.path}
            </Alert>
          </Padding>
          <Padding b={1}>
            <h3>Target</h3>
            <GroupItem item={this.state.group}/>
          </Padding>
          <Padding b={1}>
            <h3>Assertions</h3>
            <AssertionItemList assertions={this.state.check.get('assertions')} response={this.state.response}/>
          </Padding>
          <Padding b={1}>
            <h3>Notifications</h3>
            <ul className="list-unstyled">
            {this.state.check.get('notifications').map(n => {
              return (
                <li><Mail inline={true} fill="primary"/> {n.value}</li>
              )
            })}
            </ul>
          </Padding>
        </div>
      )
    }else{
      return (
        <StatusHandler status={this.state.status}>
          <h3>No Checks Applied</h3>
        </StatusHandler>
      );
    }
  },
  outputLink(){
    if (this.state.check && this.state.check.get('id')){
      return (
        <Button to="checkEdit" params={{id: this.props.params.id}} color="primary" fab={true} title={`Edit ${this.state.check.name}`}>
          <Edit btn={true}/>
        </Button>
      )
    }else{
      return <span/>
    }
  },
  render() {
    return (
      <div>
        <Toolbar title={`${this.state.check.name}`}>
          {this.outputLink()}
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding tb={1}>
                {this.innerRender()}
              </Padding>
              <div className="btn-container btn-container-righty">
                <Button onClick={this.removeCheck} flat={true} color="danger" noPad={true}>
                  <Delete inline={true} fill="danger"/> Delete Check
                </Button>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});