import React from 'react';
import _ from 'lodash';
import Actions from '../../actions/CheckActions';
import Toolbar from '../global/Toolbar.jsx';
import InstanceItem from '../instances/InstanceItem.jsx';
import Store from '../../stores/CheckStore';
import Link from 'react-router/lib/components/Link';
import CheckStep1 from '../checks/CheckStep1.jsx';
import CheckStep2 from '../checks/CheckStep2.jsx';
import CheckStep3 from '../checks/CheckStep3.jsx';
import {Checkmark} from '../icons/Module.jsx';
import colors from 'seedling/colors';

function getState(){
  return {
    check:Store.getCheck(),
    response:Store.getResponse(),
    checkStep1Data:{
      foo:true
    }
  }
}

let checkStep1Data = {}
let checkStep2Data = {}
let checkStep3Data = {}

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
  getCleanData(){
    return checkStep1Data;
  },
  updateCheckStep1Data(data){
    checkStep1Data = data;
  },
  updateCheckStep2Data(data){
    checkStep2Data = data;
  },
  updateCheckStep3Data(data){
    checkStep3Data = data;
  },
  submit(){
    var obj = {};
    _.assign(obj, checkStep1Data, checkStep2Data, checkStep3Data);
    console.log(obj);
  },
  render() {
    return (
      <div className="bg-body" style={{position:"relative"}}>
        <Toolbar btnleft={true} title={`Edit Check ${this.state.check.name || this.state.check.params.id}`} >
          <Link to="check" params={{id:this.state.check.id}} className="btn btn-primary btn-fab" title="Edit {check.name}">
          </Link>
        </Toolbar>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <div ng-form="editForm">
                <div className="padding-tb">
                  <CheckStep1 {...this.state} onChange={this.updateCheckStep1Data} renderAsInclude={true}/>
                </div>
                <div className="padding-tb">
                  <CheckStep2 {...this.state} onChange={this.updateCheckStep2Data} renderAsInclude={true}/>
                </div>
                <div className="padding-tb">
                  <CheckStep3 {...this.state} onChange={this.updateCheckStep3Data} renderAsInclude={true}/>
                </div>
              </div>
              {this.state.foo}
              {
                <pre>{this.getCleanData() && JSON.stringify(this.getCleanData(), null, ' ')}</pre>
              }
              <div className="padding-tb"><br/><br/></div>
            </div>
          </div>
        </div>

        <div className="btn-container btn-container-fixed btn-container-bordered-top btn-container-righty">
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                  <button type="button" onClick={this.submit.bind(this)} className="btn btn-flat btn-success" ng-disabled="editForm.$invalid">
                    <span>Finish&nbsp;&nbsp;
                      <Checkmark inline={true} fill={colors.success}/>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
});