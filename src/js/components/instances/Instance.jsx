import React from 'react';
import {Table, Toolbar} from '../global';
import GroupItem from '../groups/GroupItem.jsx';
import TimeAgo from 'react-timeago';
import InstanceItem from '../instances/InstanceItem.jsx';
import {InstanceStore} from '../../stores';
import {InstanceActions} from '../../actions';
import {SetInterval} from '../../modules/mixins';
import Immutable from 'immutable';

function getState(){
  return {
    instance: InstanceStore.getInstance()
  }
}

export default React.createClass({
  mixins: [InstanceStore.mixin, SetInterval],
  storeDidChange() {
    this.setState(getState());
  },
  getData(){
    InstanceActions.getInstance(this.props.params.id);
  },
  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.state.instance, nextState.instance);
  },
  componentWillMount(){
    this.getData()
  },
  componentDidMount(){
    this.setInterval(this.getData, 30000);
  },
  getInitialState(){
    return getState();
  },
  silence(id){
    InstanceActions.silence(id);
  },
  data(){
    return this.state.instance.toJS();
  },
  render() {
    return (
      <div>
        <Toolbar title={`Instance: ${this.state.instance.get('name') || this.state.instance.get('id') || ''}`}/>
        <div className="container">
          <div className="col-xs-12 col-sm-10 col-sm-offset-1">
            <div className="padding-b">
              <h3>Instance Information</h3>
              <Table>
                <tr>
                  <td><strong>State</strong></td>
                  <td>{this.data().status.state}</td>
                </tr>
                <tr>
                  <td><strong>Last Checked</strong></td>
                  <td title={`Last Checked: ${this.data().lastChecked.toISOString()}`}>
                    <TimeAgo date={this.data().lastChecked}/>
                  </td>
                </tr>
                <tr>
                  <td><strong>Created</strong></td>
                  <td>
                    <TimeAgo date={this.data().meta.created}/>
                  </td>
                </tr>
                <tr>
                  <td><strong>Instance Size</strong></td>
                  <td>{this.data().meta.instanceSize}</td>
                </tr>
              </Table>
            </div>

            <h2>Groups - ( {this.data().groups.length} )</h2>
            <ul className="list-unstyled">
              {this.state.instance.get('groups').map(g => {
                return (
                  <li key={g.get('id')}>
                    <GroupItem item={g}/>
                  </li>
                  )
              })}
            </ul>

            <h2>{this.data().checks.length} Checks</h2>
            <ul className="list-unstyled">
              {this.state.instance.get('checks').map(i => {
                return (
                  <li key={i.get('id')}>
                    <CheckItem item={i}/>
                  </li>
                  )
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
});