import React, {PropTypes} from 'react';
import {CheckActions, GroupActions} from '../../actions';
import {Toolbar, StatusHandler} from '../global';
import {GroupItem} from '../groups';
import InstanceItem from '../instances/InstanceItem.jsx';
import {CheckStore, GroupStore} from '../../stores';
import {Link} from 'react-router';
import {Edit, Delete, Mail} from '../icons';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import AssertionCounter from '../forms/AssertionCounter.jsx';
import {PageAuth} from '../../modules/statics';
import {Button} from '../forms';
import router from '../../modules/router.js';
import {Padding} from '../layout';

function getState(){
  return {
    check:CheckStore.getCheck(),
    status:CheckStore.getGetCheckStatus(),
    delStatus:CheckStore.getDeleteCheckStatus(),
    sgStatus:GroupStore.getGetGroupSecurityStatus(),
    elbStatus:GroupStore.getGetGroupELBStatus(),
    group:GroupStore.getNewGroup()
  }
}

export default React.createClass({
  mixins: [CheckStore.mixin, GroupStore.mixin],
  statics:{
    willTransitionTo:PageAuth
  },
  storeDidChange() {
    let state = getState();
    if(state.delStatus == 'success'){
      router.transitionTo('checks');
    }
    if(state.status == 'success'){
      const target = state.check.get('target');
      if(target){
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
    if(state.sgStatus == 'success' || state.elbStatus == 'success'){
      state.group = GroupStore.getGroup(this.state.check.get('target'));
    }
    this.setState(state);
  },
  getInitialState(){
    return getState();
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
  getLink(){
    const target = this.state.check.get('target');
    if(target.type == 'sg'){
      return (
        <Link to="groupSecurity" params={{id:target.id}}>{target.name || target.id}</Link>
      )
    }else{
      //elb
      return (
        <Link to="group" params={{id:target.id}}>{target.name || target.id}</Link>
      )
    }
  },
  getTarget(){
    GroupStore.getGroupFromFilter()
  },
  innerRender(){
    if(!this.state.error && this.state.check.get('id')){
      return(
        <div>
          <Padding b={1}>
            <h3>Target</h3>
            <GroupItem item={this.state.group}/>
          </Padding>

          <Padding b={1}>
            <h3>Request</h3>
            <table className="table">
              <tr>
                <td><strong>Path</strong></td>
                <td>{this.getCheckJS().check_spec.value.path}</td>
              </tr>
              <tr>
                <td><strong>Port</strong></td>
                <td>{this.getCheckJS().check_spec.value.port}</td>
              </tr>
              <tr>
                <td><strong>Protocol</strong></td>
                <td>{this.getCheckJS().check_spec.value.protocol}</td>
              </tr>
              <tr>
                <td><strong>Method</strong></td>
                <td>{this.getCheckJS().check_spec.value.verb}</td>
              </tr>
            </table>
          </Padding>
          <Padding b={1}>
            <h3>Assertions</h3>
            {this.state.check.get('assertions').map(a => {
              return(
                <ol className="list-unstyled">
                  <li>
                    <span>{a.key}</span>&nbsp;
                    <span className="text-secondary">{a.relationship}</span>&nbsp;
                    <strong>{a.operand}</strong>
                  </li>
                </ol>
              )
            })}
          </Padding>
          <Padding b={1}>
            <h3>Notifications</h3>
            <ul className="list-unstyled">
            {this.state.check.get('notifications').map(n => {
              return(
                <li><Mail inline={true}/> {n.value}</li>
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
    if(this.state.check && this.state.check.get('id')){
      return (
        <Link to="checkEdit" params={{id:this.props.params.id}} className="btn btn-primary btn-fab" title={`Edit ${this.state.check.name}`}>
          <Edit btn={true}/>
        </Link>
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
                <Button onClick={this.removeCheck} flat={true} bsStyle="danger"><Delete className="icon"/> Delete Check</Button>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});