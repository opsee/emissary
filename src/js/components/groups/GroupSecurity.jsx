import React, {PropTypes} from 'react';
import Immutable from 'immutable';
import _ from 'lodash';

import {StatusHandler, Table, Toolbar} from '../global';
import {CheckItemList} from '../checks';
import {InstanceItemList} from '../instances';
import {GroupStore} from '../../stores';
import {GroupActions} from '../../actions';
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
  },
  getState(){
    return {
      group: GroupStore.getGroup({
        type: 'security',
        id: this.props.params.id
      }),
      status: GroupStore.getGetGroupSecurityStatus()
    };
  },
  getInstanceIds(){
    if (this.state.group.get('name')){
      return _.pluck(this.state.group.instances.toJS(), 'id');
    }
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
            <h3>{this.state.group.get('id')} Information</h3>
            <Table>
              <tr>
                <td><strong>Description</strong></td>
                <td>{this.renderDescription()}</td>
              </tr>
            </Table>
          </Padding>
          <Padding b={1}>
            <h3>Checks</h3>
            <CheckItemList type="groupSecurity" target={this.props.params.id}/>
          </Padding>
          <Padding b={1}>
            <h3>Instances</h3>
            <InstanceItemList ids={this.getInstanceIds()}/>
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