import React, {PropTypes} from 'react';
import _ from 'lodash';

import {StatusHandler, Table, Toolbar} from '../global';
import GroupItem from '../groups/GroupItem.jsx';
import TimeAgo from 'react-timeago';
import {InstanceStore} from '../../stores';
import {InstanceActions} from '../../actions';
import {SetInterval} from '../../modules/mixins';
import Immutable from 'immutable';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {PageAuth} from '../../modules/statics';
import {Padding} from '../layout';
import {Button} from '../forms';
import {Add} from '../icons';

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
  renderInner(){
    if (this.state.instance.get('name')){
      return (
        <div>
          <Padding b={2}>
            <Button color="primary" flat to="checkCreateRequest" query={{target: {id: this.state.instance.get('id'), type: 'EC2', name: this.state.instance.get('name')}}} title="Create New Check">
              <Add fill="primary" inline/> Create a Check
            </Button>
          </Padding>
          <Table>
            <tr>
              <td><strong>State</strong></td>
              <td>{this.state.instance.get('state')}</td>
            </tr>
            <tr>
              <td><strong>Last Checked</strong></td>
              <td title={`Last Checked: ${this.state.instance.get('lastChecked').toISOString()}`}>
                <TimeAgo date={this.state.instance.get('lastChecked')}/>
              </td>
            </tr>
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
          </Table>
          <Padding b={1}>
            <h3>Groups ({this.state.instance.get('groups').size})</h3>
            <ul className="list-unstyled">
              {this.state.instance.get('groups').map(g => {
                return (
                  <li key={g.get('id')}>
                    <GroupItem item={g}/>
                  </li>
                  );
              })}
            </ul>
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