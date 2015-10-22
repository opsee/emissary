import React from 'react';
import {StatusHandler, Table, Toolbar} from '../global';
import {CheckItemList} from '../checks';
import {InstanceItemList} from '../instances';
import TimeAgo from 'react-components/timeago';
import GroupItem from './GroupItem.jsx';
import {GroupStore, InstanceStore} from '../../stores';
import {GroupActions, CheckActions, InstanceActions} from '../../actions';
import {SetInterval} from '../../modules/mixins';
import Immutable from 'immutable';
import {Grid, Row, Col} from '../../modules/bootstrap';

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
    GroupActions.getGroupSecurity(this.props.params.id);
    InstanceActions.getInstancesECC({
      id:this.props.params.id,
      type:'security'
    })
  },
  getState(){
    return {
      group:GroupStore.getGroup({
        type:'security',
        id:this.props.params.id
      }),
      instances:InstanceStore.getInstancesECC({
        type:'security',
        id:this.props.params.id
      }),
      status:GroupStore.getGetGroupSecurityStatus(),
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
          <Toolbar title={`Group: ${this.state.group.get('name') || this.state.group.get('id') || ''}`}/>
          <Grid>
            <Row>
              <Col xs={12}>
                <div className="padding-b">
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
                </div>
                <div className="padding-b">
                  <h3>Instances ({this.state.group.get('instances').length})</h3>
                  <InstanceItemList instances={this.state.group.get('instances')}/>
                </div>
                <div className="padding-b">
                  <h3>Checks</h3>
                  <CheckItemList type="groupSecurity" id={this.props.params.id}></CheckItemList>
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