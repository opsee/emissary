import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Grid, Row, Col, TabbedArea, TabPane} from 'react-bootstrap';
import Button from '../forms/OpseeButton.jsx';
import Toolbar from '../global/Toolbar.jsx';
import Loader from '../global/Loader.jsx';
import CheckItem from '../checks/CheckItem.jsx';

import Store from '../../stores/Check';
import Actions from '../../actions/Styleguide';
import GlobalActions from '../../actions/Global';

import {Add} from '../icons/Module.jsx';
import OpseeToggle from '../forms/OpseeToggle.jsx';

function getState(){
  return {
    checks: Store.getChecks(),
    toggles:[{on:true},{on:false},{on:true}]
  }
}
export default React.createClass({
  mixins: [Store.mixin],
  getInitialState(){
    return getState();
  },
  storeDidChange() {
    this.setState(getState());
  },
  getDefaultProps() {
    return getState();
  },
  triggerToggle(index){
    let toggles = this.state.toggles;
    toggles[index].on = !toggles[index].on;
    this.setState({toggles:toggles});
  },
  notify(){
    GlobalActions.globalModalMessage('This is a test of the notification system, <a href="http://google.com" target="_blank">even including html</a>');
  },
  render() {
    return (
      <div>
      <Toolbar title="Opsee Styleguide">
        <a className="btn btn-success btn-fab" title="Primary Action" tooltip="A Test Button" tooltip-placement="left">
          <Add btn={true}/>
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
          {['brand-primary','brand-success','brand-info','brand-warning','brand-danger'].map((color, i) =>{
            return (
              <div className="clearfix" key={`color-${i}`}>
                <div className={`bg-${color} pull-left`} style={{width:"45px",height:"45px"}} type="button"></div>
                <div className="padding pull-left">{color}</div>
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
              <li key={`unordered-item-${i}`}>List Item {i}</li>
            );
          })}
          </ul>

          <hr/>

          <h2 className="h3">Ordered List</h2>
          <ol>
            {[1,2,3,4].map(i => {
            return( 
              <li key={`ordered-item-${i}`}>List Item {i}</li>
              );
            })}
          </ol>

          <h3>Toggle Switches</h3>
          <ul className="list-unstyled">
          {this.state.toggles.map((t,i) => {
            return(
              <li className="display-flex flex-wrap padding-tb" key={`toggle-${i}`}>
                <OpseeToggle on={t.on}/>
                <div className="flex-1">
                  <label className="user-select-none" onClick={this.triggerToggle.bind(null, i)}>Item </label>
                </div>
              </li>
            )
          })}
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
          {_.range(1).map((i, ci) => {
            return(
              <ul className="list-unstyled" key={`check-list-${ci}`}>
              {this.props.checks.map((check, id) => {
                return (
                  <li key={`check-${id}`}>
                    <CheckItem {...check}/>
                  </li>
                );
              })}
              </ul>
            )
          })}

          <hr/>

          <h3>Cards</h3>
          <Row>
          {[1,2,3,4].map(i => {
            return (
              <Col xs={12} sm={6} className="padding-tb" key={`card-${i}`}>
                <div className="bg-gray-900 md-shadow-bottom-z-1">
                  <div className="padding">
                    <h2 className="margin-none">A title goes here</h2>
                    <div>
                      <div><a href="mailto:">test@opsee.co</a></div>
                      <span>#352346 - Created on 12/05/15</span>
                    </div>
                  </div>
                  <div>
                    <Button bsStyle="default" flat={true}>Delete</Button>
                    <Button bsStyle="primary" flat={true} className="pull-right">Activate</Button>
                  </div>
                </div>
              </Col>
            )
          })}
          </Row>

          <hr/>

          <h3>Forms</h3>

          <form name="testform" id="testform">
            <div className="form-group display-flex flex-wrap">
              <input id="testinput1" name="testinput1" type="text" ng-model="user.account.team_name" placeholder="input placeholder" className="form-control flex-order-1" ng-required="true" ng-minlength="3"/>
              <label htmlFor="testinput1">
                <span>Text Input Label</span>
                <default-messages ng-model="testform.testinput1"></default-messages>
              </label>
            </div>

            <div className="form-group display-flex flex-wrap">
              <input id="testinput2" name="testinput2" type="text" placeholder="email@domain.com" className="form-control has-icon flex-order-1" ng-required="true" ng-pattern="regex.email" ng-model="testinput2"/>
              <label htmlFor="testinput2">
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
              <div className="padding pull-left">
              {['primary','success','warning','danger','info','default'].map(i => {
                return (
                  <button className={"btn btn-"+i} type="button" key={`btn-${i}`}>{i}</button>
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
                  <div className="padding pull-left" key={`btn-flat-${i}`}>
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
          <button className="btn btn-primary" onClick={this.notify}>GLOBAL NOTIFICATION</button>
        </div>
      </div>
      </div>
    );
  }
});
