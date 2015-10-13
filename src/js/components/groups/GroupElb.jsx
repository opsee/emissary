import React from 'react';
import {Toolbar, StatusHandler} from '../global';
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
      return (
        <p>{desc}</p>
      )
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
              <Col xs={12} sm={10} smOffset={1}>
                {this.renderDescription()}
                <table className="table">
                  <tr>
                    <td><strong>State</strong></td>
                    <td>{this.state.group.get('state')}</td>
                  </tr>
                  <tr>
                    <td><strong>Id</strong></td>
                    <td>{this.state.group.get('id')}</td>
                  </tr>
                </table>
                <div className="padding-b">
                  <h2>Instances</h2>
                  <InstanceItemList instances={this.state.group.get('instances')}/>
                </div>
                <h2>Checks</h2>
                <CheckItemList type="groupELB" id={this.props.params.id}></CheckItemList>
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