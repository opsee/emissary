import React, {PropTypes} from 'react';
import TimeAgo from 'react-timeago';
import _ from 'lodash';

import {Table, Toolbar, StatusHandler} from '../global';
import {CheckItemList} from '../checks';
import {InstanceItemList} from '../instances';
import {GroupStore} from '../../stores';
import {GroupActions} from '../../actions';
import {SetInterval} from '../../modules/mixins';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Add} from '../icons';
import {Padding} from '../layout';

export default React.createClass({
  mixins: [GroupStore.mixin, SetInterval],
  propTypes: {
    params: PropTypes.object
  },
  componentWillMount(){
    this.getData();
  },
  componentDidMount(){
    this.setInterval(this.getData, 30000);
  },
  getInitialState(){
    return this.getState();
  },
  storeDidChange() {
    const state = this.getState();
    this.setState(state);
  },
  getData(){
    GroupActions.getGroupELB(this.props.params.id);
  },
  getState(){
    return {
      group: GroupStore.getGroup({
        type: 'elb',
        id: this.props.params.id
      }),
      status: GroupStore.getGetGroupELBStatus()
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
      return (
        <tr>
          <td><strong>Description</strong></td>
          <td>{desc}</td>
        </tr>
      );
    }
    return <tr/>;
  },
  renderLastChecked(){
    const d = this.state.group.lastChecked;
    if (d){
      return (
        <tr>
          <td><strong>Last Checked</strong></td>
          <td title={`Last Checked: ${d.toISOString()}`}>
            <TimeAgo date={this.state.group.get('lastChecked')}/>
          </td>
        </tr>
      );
    }
    return <tr/>;
  },
  renderInner(){
    if (this.state.group.get('name')){
      return (
        <div>
          <Padding b={2}>
            <Button color="primary" flat to="checkCreateRequest" query={{target: {id: this.state.group.get('id'), type: 'elb'}}} title="Create New Check">
              <Add fill="primary" inline/> Create a Check
            </Button>
          </Padding>
          <Padding b={1}>
            <h3>{this.state.group.get('id')} Information</h3>
            <Table>
              <tr>
                <td><strong>Created</strong></td>
                <td><TimeAgo date={new Date(this.state.group.get('CreatedTime'))}/></td>
              </tr>
              {this.renderLastChecked()}
              {this.renderDescription()}
            </Table>
          </Padding>
          <Padding b={1}>
            <h3>Checks</h3>
            <CheckItemList type="groupELB" target={this.props.params.id}/>
          </Padding>
          <Padding b={1}>
            <h3>Instances ({this.state.group.get('instances').size})</h3>
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
        <Toolbar title={`ELB: ${this.state.group.get('name') || this.state.group.get('id') || this.props.params.id}`} />
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