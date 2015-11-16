import React, {PropTypes} from 'react';
import _ from 'lodash';
import {List} from 'immutable';

import {StatusHandler, Table, Toolbar} from '../global';
import TimeAgo from 'react-timeago';
import {InstanceStore, GroupStore} from '../../stores';
import {InstanceActions} from '../../actions';
import {SetInterval} from '../../modules/mixins';
import Immutable from 'immutable';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {PageAuth} from '../../modules/statics';
import {Padding} from '../layout';
import {Button} from '../forms';
import {Add} from '../icons';
import {GroupItemList} from '../groups';
import {CheckItemList} from '../checks';

function getState(){
  return {
    instance: InstanceStore.getInstanceECC(),
    status: InstanceStore.getGetInstanceECCStatus()
  };
}

export default React.createClass({
  mixins: [InstanceStore.mixin, SetInterval],
  statics: {
    willTransitionTo: PageAuth
  },
  propTypes: {
    params: PropTypes.object
  },
  componentWillMount(){
    this.getData();
  },
  componentDidMount(){
    this.setInterval(this.getData, 30000);
  },
  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.state.instance, nextState.instance) || this.state !== nextState;
  },
  getInitialState(){
    return getState();
  },
  storeDidChange() {
    const state = getState();
    this.setState(state);
  },
  getData(){
    InstanceActions.getInstanceECC(this.props.params.id);
  },
  getGroups(){
    const group = GroupStore.getGroupFromFilter({id: this.state.instance.get('groups').toJS()[0].id});
    if (group){
      return new List([group]);
    }
    return this.state.instance.get('groups');
  },
  getGroupIds(){
    if (this.state.instance.get('name')){
      return _.pluck(this.state.instance.groups.toJS(), 'id');
    }
  },
  renderAvailabilityZone(){
    const az = _.get(this.state.instance.get('Placement'), 'AvailabilityZone');
    if (az){
      return (
        <tr>
          <td><strong>Availability Zone</strong></td>
          <td>{az}</td>
        </tr>
      );
    }
    return <tr/>;
  },
  renderLastChecked(){
    const d = this.state.instance.lastChecked;
    if (d){
      return (
        <tr>
          <td><strong>Last Checked</strong></td>
          <td title={`Last Checked: ${d.toISOString()}`}>
            <TimeAgo date={this.state.instance.get('lastChecked')}/>
          </td>
        </tr>
      );
    }
    return <tr/>;
  },
  renderInner(){
    if (this.state.instance.get('name')){
      return (
        <div>
          <Padding b={2}>
            <Button color="primary" flat to="checkCreateRequest" query={{target: {id: this.state.instance.get('id'), type: 'EC2', name: this.state.instance.get('name')}}} title="Create New Check">
              <Add fill="primary" inline/> Create a Check
            </Button>
          </Padding>

          <Padding b={1}>
            <h3>{this.props.params.id} Information</h3>
            <Table>
              <tr>
                <td><strong>Launched</strong></td>
                <td>
                  <TimeAgo date={this.state.instance.get('LaunchTime')}/>
                </td>
              </tr>
              <tr>
                <td><strong>Instance Type</strong></td>
                <td>{this.state.instance.get('InstanceType')}</td>
              </tr>
              {this.renderAvailabilityZone()}
              {this.renderLastChecked()}
            </Table>
          </Padding>
          <Padding b={1}>
            <h3>Checks</h3>
            <CheckItemList type="instance" target={this.props.params.id}/>
          </Padding>
          <Padding b={1}>
            <GroupItemList ids={this.getGroupIds()} title="Security Groups"/>
          </Padding>
          <Padding b={1}>
            <GroupItemList type="elb" instanceIds={[this.state.instance.get('id')]} title="ELBs" noFallback/>
          </Padding>
          {
            // <h2>{this.data().checks.length} Checks</h2>
            // <ul className="list-unstyled">
            //   {this.state.instance.get('checks').map(i => {
            //     return (
            //       <li key={i.get('id')}>
            //         <CheckItem item={i}/>
            //       </li>
            //       )
            //   })}
            // </ul>
          }
        </div>
      );
    }
    return <StatusHandler status={this.state.status}/>;
  },
  render() {
    return (
      <div>
        <Toolbar title={`Instance: ${this.state.instance.get('name') || this.state.instance.get('id') || this.props.params.id}`}/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderInner()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});