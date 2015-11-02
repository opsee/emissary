import React, {PropTypes} from 'react';
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
import AssertionItemList from './AssertionItemList.jsx';

function getState(){
  return {
    check: CheckStore.getCheck(),
    status: CheckStore.getGetCheckStatus(),
    delStatus: CheckStore.getDeleteCheckStatus(),
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
      response: null
    });
  },
  storeDidChange() {
    let state = getState();
    if (state.delStatus === 'success'){
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
    const target = this.state.check.get('target');
    const group = this.state.group.toJS();
    if (target.type === 'sg'){
      return (
        <span>{group.name || group.id}</span>
      );
    }
    //elb
    return (
      <span>{group.name || group.id}</span>
    );
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
                <li><Mail inline/> {n.value}</li>
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
        <Toolbar title={`${this.state.check.name}`}>
          {this.renderLink()}
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={3}>
                {this.innerRender()}
              </Padding>
              <Button onClick={this.removeCheck} flat color="danger">
                <Delete inline fill="danger"/> Delete Check
              </Button>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});