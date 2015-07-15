import React, {PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import TabbedArea from 'react-bootstrap/lib/TabbedArea';
import TabPane from 'react-bootstrap/lib/TabPane';
import Toolbar from '../global/Toolbar.jsx';
import Loader from '../global/Loader.jsx';
const classNames = require('classnames');

export default React.createClass({
  getInitialState() {
    return {
    }
  },
  render() {
    return (
      <div>
      <Toolbar title="Opsee Styleguide">
        <a className="btn btn-success btn-fab" title="Primary Action" tooltip="A Test Button" tooltip-placement="left">
        </a>
      </Toolbar>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-sm-10 col-sm-offset-1">
          <TabbedArea defaultActiveKey={2}>
            <TabPane eventKey={1} tab='Tab 1'>TabPane 1 content</TabPane>
            <TabPane eventKey={2} tab='Tab 2'>TabPane 2 content</TabPane>
          </TabbedArea>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="col-xs-12 col-sm-10 col-sm-offset-1">
          <div><br/></div>
          <div>
            <img src="/node_modules/seedling/img/logo-color-border-light.svg" width="150"/>
          </div>
          <div><br/></div>
          {['brand-primary','brand-success','brand-info','brand-warning','brand-danger'].map(i =>{
            return (
              <div className="clearfix">
                <div className={'bg-'+i+' pull-left'} style={{width:"45px",height:"45px"}} type="button"></div>
                <div className="padding pull-left">{i}</div>
              </div>
            )
          })}
          <h1>Header Level 1: Instance Passing, Started Three Hours</h1>
          <h2>Header Level 2: Resource Restarted, Checking Availability</h2>
          <h3>Header Level 3: Check Currently Unmonitored</h3>

          <p>Paragraph. Wornall Homestead pork spare ribs maple mild BB's Lawnside smoked turkey Jack Stack mixed plate Crossroads hog heaven <span className="text-info">West Side strawberry soda</span> smoker drop. Entire loaf of white bread team Novel Restaurant chicken wings fun KC Strip chorizo Arthur Bryant's works ham River Market short end sandwiches baby back ribs rarely.</p>

          <hr/>

          <h2 className="h3">Unordered List</h2>
          <ul>
          {[1,2,3,4].map(i => {
            return( 
              <li>List Item {i}</li>
            );
          })}
          </ul>

          <hr/>

          <h2 className="h3">Ordered List</h2>
          <ol>
            {[1,2,3,4].map(i => {
            return( 
              <li>List Item {i}</li>
              );
            })}
          </ol>

          <h3>Toggle Switches</h3>
          <ul className="list-unstyled">
            <li className="display-flex flex-wrap padding-tb" ng-repeat="o in [{},{selected:true},{}]">
              <toggle-switch ng-model="o.selected"></toggle-switch>
              <div className="flex-1">
                <label className="user-select-none" ng-click="o.selected = !o.selected">Item </label>
              </div>
            </li>
          </ul>

          <hr/>

          <h3>Data Tables</h3>

          <table className="table">
            <thead>
              <tr>
                <th>Head1</th>
                <th>Head1</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Col 1</td>
                <td>Col 2</td>
              </tr>
              <tr>
                <td>Col 1</td>
                <td>Col 2</td>
              </tr>
              <tr>
                <td>Col 1</td>
                <td>Col 2</td>
              </tr>
            </tbody>
          </table>

          <hr/>

          <h2 className="h3">Checks</h2>
          <ul className="list-unstyled">
            <li ng-repeat="check in checks">
              <check-item check="check"></check-item>
            </li>
          </ul>

          <hr/>

          <h3>Cards</h3>
          <div className="row">
          {[1,2,3,4].map(i => {
            return (
              <div className="col-xs-12 col-sm-6 padding-tb">
                <div className="bg-gray-900 md-shadow-bottom-z-1">
                  <div className="padding">
                    <h2 className="margin-none">A title goes here</h2>
                    <div>
                      <div><a href="mailto:">test@opsee.co</a></div>
                      <span>#352346 - Created on 12/05/15</span>
                    </div>
                  </div>
                  <div>
                    <button type="button" className="btn btn-flat btn-default">Delete</button>
                    <button type="button" className="btn btn-flat btn-primary pull-right">Activate</button>
                  </div>
                </div>
              </div>
            )
          })}
          </div>

          <hr/>

          <h3>Forms</h3>

          <form name="testform" id="testform">
            <div className="form-group display-flex flex-wrap">
              <input id="testinput1" name="testinput1" type="text" ng-model="user.account.team_name" placeholder="input placeholder" className="form-control flex-order-1" ng-required="true" ng-minlength="3"/>
              <label for="testinput1">
                <span>Text Input Label</span>
                <default-messages ng-model="testform.testinput1"></default-messages>
              </label>
            </div>

            <div className="form-group display-flex flex-wrap">
              <input id="testinput2" name="testinput2" type="text" placeholder="email@domain.com" className="form-control has-icon flex-order-1" ng-required="true" ng-pattern="regex.email" ng-model="testinput2"/>
              <label for="testinput2">
                <span>Email (w/icon)</span>
                <default-messages ng-model="testform.testinput2"></default-messages>
              </label>
            </div>

            <div className="form-group">
              <div dropdown>
                <select id="test-group" className="sr-only" ng-required="true"></select>
                <button type="button" className="btn btn-block dropdown-toggle" dropdown-toggle></button>
                <ul className="dropdown-menu">
                  <li ng-repeat="o in [1,2,3]">
                    <button type="button" className="btn" dropdown-toggle ng-click="selectDropdown(o)">Option</button>
                    </li>
                </ul>
              </div>
            </div>

            <h3>Buttons</h3>

            <div className="padding-bx2">
              <div className="padding pull-left" ng-repeat="b in ['primary','success','warning','danger','info','default']">
              {['primary','success','warning','danger','info','default'].map(i => {
                return (
                  <button className={"btn btn-"+i} type="button">{i}</button>
                )
              })}
              </div>
              <div className="padding pull-left">
                <button className="btn btn-success" disabled={true}>Disabled</button>
              </div>
              <div><br/></div>
              <button className="btn btn-default btn-block" type="submit">Block</button>
            </div>

            <h3>Flat Buttons</h3>

            <div className="padding-bx2">
              {['primary','success','warning','danger','info','default'].map(i => {
                return (
                  <div className="padding pull-left">
                    <button className={"btn btn-flat btn-"+i} type="button">{i}</button>
                  </div>
                )
              })}
              <div className="padding pull-left">
                <button className="btn btn-flat btn-success" disabled={true}>Disabled</button>
              </div>
              <div><br/></div>
              <button className="btn btn-flat btn-default btn-block" type="submit">Block</button>
            </div>

            <div className="padding-bx2">
              <button type="button" className="btn btn-flat btn-nopad btn-primary" ng-click="check.addItem('http.headers')">
                <span>NO PAD</span>
              </button>
            </div>
          </form>

          <h3>Loading State</h3>
          <Loader/>

          <h3>Notifcations</h3>
          <button className="btn btn-primary" ng-click="notify()">GLOBAL NOTIFICATION</button>
        </div>
      </div>
      </div>
    );
  }
});
