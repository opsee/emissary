import React, {PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import TaskList from '../TaskList.jsx';
import RadialGraph from '../global/RadialGraph.jsx';
import Store from '../../stores/HomeStore';
import ActionCreator from '../../actions/Todo';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import GroupItem from '../groups/GroupItem.jsx';

function getState(){
  return {
    instances: Store.getInstances(),
    groups: Store.getGroups()
  }
}
export default React.createClass({
  mixins: [Store.mixin],
  storeDidChange() {
    this.setState(getState());
  },
  getDefaultProps() {
    return getState();
  },
  render() {
    return (
      <div>
        <Toolbar title="Environment"/>
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                <ul className="nav nav-tabs">
                  <li className="{active:$state.is('home.instances')}">
                    <a href="#" ui-sref="home.instances">Instances</a>
                  </li>
                  <li className="{active:$state.is('home.groups')}">
                    <a href="#" ui-sref="home.groups">Groups</a>
                  </li>
                </ul>
              </div>
            </div>
              <ul className="list-unstyled">
                {this.props.instances.map(i => {
                  return (
                    <li>
                      <InstanceItem {...i}/>
                    </li>
                    )
                })}
              </ul>
              <ul className="list-unstyled">
                {this.props.groups.map(i => {
                  return (
                    <li>
                      <GroupItem {...i}/>
                    </li>
                    )
                })}
              </ul>
          </div>
      </div>
    );
  }
});
