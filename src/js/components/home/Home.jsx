import React, {PropTypes} from 'react';
import {Button} from '../../modules/bootstrap';
import {RadialGraph} from '../global';
import {HomeStore} from '../../stores';
import {Toolbar} from '../global';
import InstanceItem from '../instances/InstanceItem.jsx';
import GroupItem from '../groups/GroupItem.jsx';
import {RouteHandler} from 'react-router';
import {Link} from 'react-router';
import {InstanceActions, GlobalActions} from '../../actions';
import {PageAuth} from '../../modules/statics';

function getState(){
  return {
    instances: HomeStore.getInstances(),
    groups: HomeStore.getGroups()
  }
}
export default React.createClass({
  mixins: [HomeStore.mixin],
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
