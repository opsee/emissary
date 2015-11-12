import React, {PropTypes} from 'react';
import Immutable from 'immutable';

import {StatusHandler, Table, Toolbar} from '../global';
import {CheckItemList} from '../checks';
import {InstanceItemList} from '../instances';
import {GroupStore, InstanceStore} from '../../stores';
import {GroupActions, InstanceActions} from '../../actions';
import {SetInterval} from '../../modules/mixins';
import {Button} from '../forms';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Add} from '../icons';
import {PageAuth} from '../../modules/statics';
import {Padding} from '../layout';

const GroupSecurity = React.createClass({
  mixins: [GroupStore.mixin, SetInterval],
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
    return !Immutable.is(this.state.group, nextState.group);
  },
  getInitialState(){
    return this.getState();
  },
  storeDidChange() {
    const state = this.getState();
    this.setState(state);
  },
  getData(){
    GroupActions.getGroupSecurity(this.props.params.id);
    InstanceActions.getInstancesECC({
      id: this.props.params.id,
      type: 'security'
    });
  },
  getState(){
    return {
      group: GroupStore.getGroup({
        type: 'security',
        id: this.props.params.id
      }),
      instances: InstanceStore.getInstancesECC({
        type: 'security',
        id: this.props.params.id
      }),
      status: GroupStore.getGetGroupSecurityStatus(),
      getInstanceECCStatus: InstanceStore.getGetInstanceECCStatus()
    };
  },
  renderDescription(){
    const desc = this.state.group.get('Description');
    if (desc && desc !== ''){
      return <span>{desc}</span>;
    }
    return <div/>;
  },
  renderInner(){
    if (this.state.group.get('name')){
      return (
        <div>
          <Padding b={2}>
            <Button color="primary" flat to="checkCreateRequest" query={{target: {id: this.state.group.get('id'), type: 'security', name: this.state.group.get('name')}}} title="Create New Check">
              <Add fill="primary" inline/> Create a Check
            </Button>
          </Padding>

          <Padding b={1}>
            <h3>Group Information</h3>
            <Table>
              <tr>
                <td><strong>Id</strong></td>
                <td>{this.state.group.get('id')}</td>
              </tr>
              <tr>
                <td><strong>State</strong></td>
                <td>{this.state.group.get('state')}</td>
              </tr>
              <tr>
                <td><strong>Description</strong></td>
                <td>{this.renderDescription()}</td>
              </tr>
            </Table>
          </Padding>
          <Padding b={1}>
            <h3>Instances</h3>
            <InstanceItemList instances={this.state.group.get('instances')}/>
          </Padding>
          <Padding b={1}>
            <h3>Checks</h3>
            <CheckItemList type="groupSecurity" id={this.props.params.id}/>
          </Padding>
        </div>
      );
    }
    return <StatusHandler status={this.state.status}/>;
  },
  render() {
    return (
      <div>
        <Toolbar title={`Group: ${this.state.group.get('name') || this.state.group.get('id') || this.props.params.id}`} />
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

export default GroupSecurity;