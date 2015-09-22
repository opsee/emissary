import React from 'react';
import {Toolbar} from '../global';
import {CheckItemList} from '../checks';
import {InstanceItemList} from '../instances';
import TimeAgo from 'react-components/timeago';
import GroupItem from './GroupItem.jsx';
import {GroupStore} from '../../stores';
import {GroupActions, CheckActions} from '../../actions';
import {SetInterval} from '../../modules/mixins';
import Immutable from 'immutable';
import {Grid, Row, Col} from '../../modules/bootstrap';

function getState(){
  return {
    group:GroupStore.getGroupSecurity(),
    getGroupStatus:GroupStore.getGetGroupSecurityStatus()
  }
}

export default React.createClass({
  mixins: [GroupStore.mixin, SetInterval],
  storeDidChange() {
    const state = getState();
    this.setState(state);
  },
  // shouldComponentUpdate(nextProps, nextState) {
  //   return !Immutable.is(this.state.group, nextState.group);
  // },
  getData(){
    GroupActions.getGroupSecurity(this.props.params.id);
  },
  componentWillMount(){
    this.getData();
  },
  componentDidMount(){
    this.setInterval(this.getData, 30000);
  },
  componentWillUnmount(){
    this.setState(getState());
  },
  getInitialState(){
    return getState();
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
  getInstances(){
    if(this.state.group.get('instances').size){
      return (
        <div>
          <h2>Instances - ( {this.state.group.get('instances').size} )</h2>
          <ul className="list-unstyled">
            {this.state.group.get('instances').map(instance => {
              return (
                <li key={instance.get('id')}>
                  <InstanceItem item={instance}/>
                </li>
                )
            })}
          </ul>
        </div>
      )
    }else{
      return <h2>No Instances</h2>
    }
  },
  render() {
    if(this.state.group.get('id')){
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
                <InstanceItemList id={this.state.group.get('id')} type={'security'}/>
                {
                  // this.getInstances()
                }
                <CheckItemList type="groupSecurity" id={this.props.params.id}></CheckItemList>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }else{
      return (
        <div>
          <Toolbar title="Group"/>
        </div>
      )
    }
  }
});