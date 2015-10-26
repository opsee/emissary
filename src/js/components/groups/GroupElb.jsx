import React from 'react';
import Immutable from 'immutable';

import {Table, Toolbar, StatusHandler} from '../global';
import {CheckItemList} from '../checks';
import {InstanceItemList} from '../instances';
import TimeAgo from 'react-components/timeago';
import GroupItem from './GroupItem.jsx';
import {GroupStore, InstanceStore} from '../../stores';
import {GroupActions, CheckActions, InstanceActions} from '../../actions';
import {SetInterval} from '../../modules/mixins';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Add} from '../icons';
import {Padding} from '../layout';

export default React.createClass({
  mixins: [GroupStore.mixin, SetInterval],
  storeDidChange() {
    const state = this.getState();
    this.setState(state);
  },
  // shouldComponentUpdate(nextProps, nextState) {
  //   return !Immutable.is(this.state.group, nextState.group);
  // },
  getData(){
    GroupActions.getGroupELB(this.props.params.id);
    InstanceActions.getInstancesECC({
      id:this.props.params.id,
      type:'elb'
    })
  },
  getState(){
    return {
      group:GroupStore.getGroup({
        type:'elb',
        id:this.props.params.id
      }),
      instances:InstanceStore.getInstancesECC({
        type:'elb',
        id:this.props.params.id
      }),
      status:GroupStore.getGetGroupELBStatus(),
      getInstanceECCStatus:InstanceStore.getGetInstanceECCStatus()
    }
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
  renderDescription(){
    const desc = this.state.group.get('Description');
    if(desc && desc != ''){
      return {desc}
    }else{
      return <div/>
    }
  },
  render() {
    if(this.state.group.get('name')){
      return (
        <div>
          <Toolbar title={`ELB: ${this.state.group.get('name') || this.state.group.get('id') || ''}`}/>
          <Grid>
            <Row>
              <Col xs={12}>
                <div className="padding-b">
                  <h3>ELB Information</h3>
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
                </div>
                <div className="padding-b">
                  <h3>Instances ({this.state.group.get('instances').size})</h3>
                  <InstanceItemList instances={this.state.group.get('instances')}/>
                </div>
                <div className="padding-b">
                  <h3>Checks</h3>
                  <CheckItemList type="groupELB" id={this.props.params.id}></CheckItemList>
                  <Padding t={2}>
                    <Button color="primary" className="text-left" to="checkCreateRequest" query={{target:{id:this.state.group.get('id'), type:'elb'}}}>
                      <Add inline={true}/> Create Check
                    </Button>
                  </Padding>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }else{
      return <StatusHandler status={this.state.status}/>
    }
  }
});