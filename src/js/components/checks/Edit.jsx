import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/CheckActions';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import Store from '../../stores/CheckStore';
import Link from 'react-router/lib/components/Link';
import CheckStep1 from '../checks/CheckStep1.jsx';
import CheckStep2 from '../checks/CheckStep2.jsx';
import CheckStep3 from '../checks/CheckStep3.jsx';

function getState(){
  return Store.getCheck()
}

export default React.createClass({
  mixins: [Store.mixin],
  getInitialState() {
    return getState()
  },
  storeDidChange() {
    this.setState(getState());
  },
  getDefaultProps() {
    return getState();
  },
  render() {
    return (
      <div className="bg-body" style={{position:"relative"}}>
        <Toolbar btnleft={true} title={`Edit Check ${this.props.name || this.props.params.id}`} >
          <Link to="check" params={{id:this.props.id}} className="btn btn-primary btn-fab" title="Edit {check.name}">
          </Link>
        </Toolbar>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <div ng-form="editForm">
                <div className="padding-tb">
                  <CheckStep1 {...this.state}/>
                </div>
                <div className="padding-tb">
                  <CheckStep2 {...this.state}/>
                </div>
                <div className="padding-tb">
                  <CheckStep3 {...this.state}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-container btn-container-fixed btn-container-bordered-top btn-container-righty">
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                  <button type="button" ng-click="save()" className="btn btn-flat btn-success" ng-disabled="editForm.$invalid">
                    <span>Finish 
                    {
                    //<svg className="icon" viewBox="0 0 24 24"><use xlink:href="#ico_checkmark" /></svg>
                    }</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
});