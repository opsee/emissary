import React from 'react';
import {Toolbar} from '../global';
import InstanceItem from '../instances/InstanceItem.jsx';
import TimeAgo from 'react-components/timeago';
import GroupItem from '../groups/GroupItem.jsx';
import {GroupStore} from '../../stores';
import {GroupActions} from '../../actions';
import {SetInterval} from '../../modules/mixins';
import Immutable from 'immutable';
import {Grid, Row, Col} from '../../modules/bootstrap';

function getState(){
  return {
    group:GroupStore.getGroupSecurity()
  }
}

export default React.createClass({
  mixins: [GroupStore.mixin, SetInterval],
  storeDidChange() {
    this.setState(getState());
  },
  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.state.group, nextState.group);
  },
  getData(){
    GroupActions.getGroupSecurity(this.props.params.id);
  },
  componentWillMount(){
    this.getData();
  },
  componentDidMount(){
    this.setInterval(this.getData, 30000);
  },
  getInitialState(){
    return getState();
  },
  render() {
    return (
      <div>
        <Toolbar title={`Group: ${this.state.group.get('name') || this.state.group.get('id') || ''}`}/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
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

              <h2>Instances - ( {this.state.group.get('instances').size} )</h2>
              <ul className="list-unstyled">
                {this.state.group.get('instances').map(i => {
                  return (
                    <li key={i.get('id')}>
                      <InstanceItem item={i}/>
                    </li>
                    )
                })}
              </ul>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});