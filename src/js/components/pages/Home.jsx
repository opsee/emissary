import React, {PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import RadialGraph from '../global/RadialGraph.jsx';
import Store from '../../stores/Home';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import GroupItem from '../groups/GroupItem.jsx';
import Router, {RouteHandler} from 'react-router';
import Link from 'react-router/lib/components/Link';
import InstanceStore from '../../stores/Instance';
import InstanceActions from '../../actions/Instance';
import {PageAuth} from '../../statics';

function getState(){
  return {
    instances: Store.getInstances(),
    groups: Store.getGroups()
  }
}
export default React.createClass({
  mixins: [Store.mixin],
  statics:{
    willTransitionTo:PageAuth
  },
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
                  <li>
                    <Link to="homeInstances">Instances</Link>
                  </li>
                  <li>
                    <Link to="homeGroups">Groups</Link>
                  </li>
                </ul>
                <RouteHandler/>
              </div>
            </div>
          </div>
      </div>
    );
  }
});
