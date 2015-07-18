import React from 'react';
import RadialGraph from '../global/RadialGraph.jsx';
import Actions from '../../actions/CheckActions';
import Link from 'react-router/lib/components/Link';

export default React.createClass({
  getDefaultProps() {
  },
  protocols:[
    {
      name:'HTTP'
    },
    {
      name:'MySQL'
    },
    {
      name:'Other'
    }
  ],
  setPort(event){
    Actions.setPort(event.target.value)
  },
  render() {
    return (
      <form name="checkStep1Form">
      <h2>Choose a Group to Check</h2>
      <div className="row">
        <div className="col-xs-12">
          <div className="form-group display-flex flex-wrap" dropdown is-open="groupDropdownOpen">
              <select id="check-group" className="sr-only" ng-required="true" ng-model="check.group" ng-options="g for g in groups"></select>
              <button type="button" className="btn btn-block dropdown-toggle" dropdown-toggle ng-disabled="disabled">
                {this.props.group.name}
                {
                  //<svg className="icon" viewBox="0 0 24 24"><use xlink:href="#ico_caret_down" /></svg>
                }
              </button>
              <ul className="dropdown-menu">
                <li ng-repeat="g in groups">
                  <button ng-click="check.group = g;" className="btn" dropdown-toggle>
                    {
                      //g.name
                    }
                  </button>
                </li>
              </ul>
          </div>
        </div>
      </div>

      <h2>Define a Request</h2>
      <div className="row">
        <div className="col-xs-12 col-sm-6">
          <div className="form-group display-flex flex-wrap" dropdown>
            <select id="check-protocol" className="sr-only" ng-required="true" ng-model="check.protocol" ng-options="p for p in protocols"></select>
            <button type="button" className="btn btn-block dropdown-toggle" dropdown-toggle ng-disabled="disabled">
              {
                //check.protocol.name || '- Protocol -'
              } 
              {
                //<svg className="icon" viewBox="0 0 24 24"><use xlink:href="#ico_caret_down" /></svg>
              }
            </button>
            <ul className="dropdown-menu">
            {this.protocols.map(protocol => {
              return(
                <li>
                  <button ng-click="check.protocol = p"  className="btn" dropdown-toggle>
                    {protocol.name}
                  </button>
                </li>
              );
            })}
            </ul>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6">
          <div className="row">
            <div className="col-xs-12">
              <div className="form-group display-flex flex-wrap" ng-className="{'has-error':checkStep1Form.checkPort.$invalid && checkStep1Form.checkPort.$touched}">
                <input id="checkPort" name="checkPort" type="text" className="form-control flex-order-1" placeholder="e.g. 80" ng-required="true" value={this.props.port} onChange={this.setPort}/>
                <label for="checkPort">
                  <span className="form-label">Port</span>
                  <default-messages ng-model="checkStep1Form.checkPort"></default-messages>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xs-12 col-sm-4">
          <div className="form-group display-flex flex-wrap" dropdown>
          {
            /*<select id="check-method" className="sr-only" ng-required="true" ng-model="check.method" ng-options="v for v in methods"></select>
            <button type="button" className="btn btn-block dropdown-toggle" dropdown-toggle ng-disabled="disabled">
              {{check.method.name || '- Method -'}} 
              {
                //<svg className="icon" viewBox="0 0 24 24"><use xlink:href="#ico_caret_down" /></svg>
              }
            </button>
            <ul className="dropdown-menu">
              <li ng-repeat="m in methods">
                <button ng-click="check.method = m" className="btn" dropdown-toggle>
                  {{m.name}}
                </button>
              </li>
            </ul>*/
          }
          </div>
        </div>
        <div className="col-xs-12 col-sm-8">
          <div className="form-group display-flex flex-wrap" ng-className="{'has-error':checkStep1Form.checkPath.$invalid}">
            <input id="checkPath" className="form-control flex-order-1" name="checkPath" type="text" ng-model="check.path" placeholder="e.g. /healthcheck" ng-required="true"/>
            <label className="flex-1" for="checkPath">
              <span className="form-label">Path</span>
              <default-messages ng-model="checkStep1Form.checkPath"></default-messages>
            </label>
          </div>
        </div>
      </div>

      <h2>Add Headers</h2>
      <div className="row">
      {
        /*<div ng-repeat="auth in check.http.headers">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <h3>Header {{$index+1}}</h3>
              </div>
            </div>
          </div>
          <div className="display-flex">
            <div className="container-fluid">
              <div className="row">
                <div className="col-xs-12 col-sm-6">
                  <div className="form-group display-flex flex-wrap">
                    <input id="check-header-key-{{$index}}" type="text" ng-model="check.http.headers[$index].key" className="form-control has-icon flex-order-1" placeholder="Key" ng-required="true"/>
                    <label for="check-header-key-{{$index}}">Key</label>
                    {
                      //<svg className="input-icon" viewBox="0 0 24 24"><use xlink:href="#ico_key" /></svg>
                    }
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6">
                  <div className="form-group display-flex flex-wrap">
                    <input id="check-header-value-{{$index}}" className="form-control flex-order-1" type="text" ng-model="check.http.headers[$index].value" placeholder="Value" ng-required="true"/>
                    <label for="check-header-value-{{$index}}">Value</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="padding-lr">
              <button type="button" className="btn btn-icon btn-flat" ng-click="check.removeItem('http.headers', $index)" title="Remove this Header">
                {
                  //<svg className="icon" viewBox="0 0 24 24"><use xlink:href="#ico_close" /></svg>
                }
              </button>
            </div>
          </div>
        </div>*/
        }
        <div className="col-xs-12">
          <button type="button" className="btn btn-flat btn-nopad btn-primary" ng-click="check.addItem('http.headers')">
          {
            //<svg className="icon" viewBox="0 0 24 24"><use xlink:href="#ico_add" /></svg> 
          }
          Add a Header</button>
        </div>
      </div>

      <div ng-if="info">
        <div className="btn-container btn-container-fixed btn-container-bordered-top btn-container-righty">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                <a href="/check-create/step-2" className="btn btn-flat btn-success" ng-disabled="checkStep1Form.$invalid">
                  <span>Next: Test This Request 
                  {
                    //<svg className="icon" viewBox="0 0 24 24"><use xlink:href="#ico_chevron_right" /></svg>
                  }
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      </form>
    );
  }
});