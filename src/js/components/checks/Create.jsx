import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/CheckActions';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import Store from '../../stores/CheckStore';
import Link from 'react-router/lib/components/Link';

function getState(){
  return Store.getCheck()
}

export default React.createClass({
  mixins: [Store.mixin],
  storeDidChange() {
    this.setState(getState());
  },
  getDefaultProps() {
    return getState();
  },
  silence(id){
    Actions.silence(id);
  },
  render() {
    return (
      <div>
        <Toolbar title="Create Check">
          <Link to="checkCreate" className="btn btn-primary btn-fab" title="Create New Check" btnPosition={true}>
          </Link>
        </Toolbar>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <div className="ui-view-container">
                <div ui-view className="transition-sibling"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});