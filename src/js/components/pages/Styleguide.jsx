import React, {PropTypes} from 'react';
import _ from 'lodash';
import forms from 'newforms';
import {Padding} from '../layout';

import {Grid, Row, Col, Tabs, Tab} from '../../modules/bootstrap';
import {Table, Toolbar, Loader} from '../global';
import CheckItem from '../checks/CheckItem.jsx';

import {CheckStore} from '../../stores';
import {GlobalActions} from '../../actions';

import {Add, Key} from '../icons';

import icons from '../icons';
import {Button, BoundField, ButtonToggle, Toggle, ToggleWithLabel, RadioWithLabel} from '../forms';

const opseeColors = ['primary', 'success', 'info', 'warning', 'danger', 'error', 'gray50', 'gray100', 'gray200', 'text', 'textSecondary', 'header'];

function getState(){
  return {
    checks: CheckStore.getChecks(),
    toggles:[{on:true},{on:false},{on:true}],
    radios:_.range(3).map(i => {
      return {id:`radio-${i}`,on:false}
    }),
    buttonToggles:['Cassandra', 'Consul', 'Docker Registry', 'Elasticsearch', 'Etcd', 'Influxdb', 'Memcached'].map((title, i) => {
      return {title:title, on:false, id:`button-toggle-${i}`}
    })
  }
}

const InfoForm = forms.Form.extend({
  name: forms.CharField({
    widgetAttrs:{
      placeholder:'Name',
      autocomplete:'off',
      title:'foo'
    }
  }),
  password: forms.CharField({
    widgetAttrs:{
      placeholder:'Password',
    }
  }),
  body: forms.CharField({
    widget: forms.Textarea,
    widgetAttrs:{
      placeholder:'Body',
    }
  }),
  validation:'auto'
});

export default React.createClass({
  mixins: [CheckStore.mixin],
  getInitialState(){
    const self = this;
    return _.extend(getState(), {
      info:new InfoForm({
        onChange:self.changeAndUpdate
      })
    })
  },
  storeDidChange() {
    this.setState(getState());
  },
  getDefaultProps() {
    return getState();
  },
  changeAndUpdate(){
    this.forceUpdate();
  },
  triggerToggle(index, bool){
    let toggles = this.state.toggles;
    toggles[index].on = bool;
    this.setState({toggles});
  },
  triggerRadio(id, bool){
    let radios = _.clone(this.state.radios);
    const index = _.findIndex(radios, {id});
    if(index > -1){
      radios = radios.map(r => {
        r.on = r.id == id ? bool : false;
        return r;
      });
      this.setState({radios});
    }
  },
  triggerButtonToggle(id, bool){
    let buttonToggles = _.clone(this.state.buttonToggles);
    const index = _.findIndex(buttonToggles, {id});
    if(index > -1){
      buttonToggles = buttonToggles.map(r => {
        r.on = r.id == id ? bool : r.on;
        return r;
      });
      this.setState({buttonToggles});
    }

    // let buttonToggles = this.state.buttonToggles
    // buttonToggles[index].on = bool;
    // this.setState({buttonToggles});
  },
  notify(style){
    GlobalActions.globalModalMessage({
      html:'This is a test of the notification system, <a href="http://google.com" target="_blank">even including html</a>',
      style:style
    });
  },
  getColor(){
    const length = opseeColors.length;
    const num = Math.round(Math.random()*length);
    return opseeColors[num];
  },
  render() {
    return (
      <div>
        <Toolbar title="Opsee Styleguide">
          <a className="btn btn-fab btn-primary" title="Primary Action" tooltip="A Test Button" tooltip-placement="left">
            <Add btn={true}/>
          </a>
        </Toolbar>

        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={1}>
                <h3>Colors</h3>
                {['brand-primary','brand-success','brand-info','brand-warning','brand-danger'].map((color, i) =>{
                  return (
                    <div className="clearfix" key={`color-${i}`}>
                      <div className={`bg-${color} pull-left`} style={{width:"45px",height:"45px"}} type="button"></div>
                      <div className="padding pull-left">{color}</div>
                    </div>
                  )
                })}
              </Padding>

              <hr/>

              <Padding b={1}>
                <h3>Typography</h3>

                <h1>Header Level 1: Instance Passing, Started Three Hours</h1>
                <h2>Header Level 2: Resource Restarted, Checking Availability</h2>
                <h3>Header Level 3: Check Currently Unmonitored</h3>

                <p>Paragraph. Wornall Homestead pork spare ribs maple mild BB's Lawnside smoked turkey Jack Stack mixed plate Crossroads hog heaven <span className="text-info">West Side strawberry soda</span> smoker drop. Entire loaf of white bread team Novel Restaurant chicken wings fun KC Strip chorizo Arthur Bryant's works ham River Market short end sandwiches baby back ribs rarely.</p>

                <h3>Icons</h3>
                <div>
                  {Object.keys(icons).map(key => {
                    return React.createElement(icons[key], {fill:this.getColor()});
                  })}
                </div>
              <hr/>

              <Padding b={1}>

                  <h3>Unordered List</h3>
                  <ul>
                  {[1,2,3,4].map(i => {
                    return(
                      <li key={`unordered-item-${i}`}>List Item {i}</li>
                    );
                  })}
                  </ul>

                  <h3>Ordered List</h3>
                  <ol>
                    {[1,2,3,4].map(i => {
                    return(
                      <li key={`ordered-item-${i}`}>List Item {i}</li>
                      );
                    })}
                  </ol>
                </Padding>

                <h3>Toggle List</h3>
                <ul className="list-unstyled">
                {this.state.toggles.map((t,i) => {
                  return(
                    <li key={`toggle-${i}`}>
                      <ToggleWithLabel on={t.on} onChange={this.triggerToggle} id={i} label="Item"/>
                    </li>
                  )
                })}
                </ul>
              </Padding>

              <hr/>

              <h3>Radio Select</h3>
              <ul className="list-unstyled">
              {this.state.radios.map((t,i) => {
                return(
                  <li className="" key={`radio-${i}`}>
                    <RadioWithLabel on={t.on} onChange={this.triggerRadio} id={`radio-${i}`} label={`Item ${i}`} />
                  </li>
                )
              })}
              </ul>

              <hr/>

          <h3>Button Toggles</h3>
            <ul className="list-unstyled flex-wrap flex-vertical-align justify-content-center">
            {this.state.buttonToggles.map((t,i) => {
              return(
                <li className="padding-tb-sm" key={`button-toggle-${i}`} style={{margin:'0 .5em'}}>
                  <ButtonToggle on={t.on} onChange={this.triggerButtonToggle} id={`button-toggle-${i}`} label={t.title} />
                </li>
              )
            })}
            </ul>

            <hr/>

            <h3>Data Tables</h3>

            <Table>
              <tr>
                <th>Head1</th>
                <th>Head1</th>
              </tr>
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
            </Table>

            <hr/>

            <h3>Checks</h3>
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

              <Padding b={1}>
                <BoundField bf={this.state.info.boundField('name')}/>
              </Padding>
              <Padding b={1}>
                <BoundField bf={this.state.info.boundField('password')}>
                  <Key className="icon"/>
                </BoundField>
              </Padding>
              <Padding b={1}>
                <BoundField bf={this.state.info.boundField('body')}/>
              </Padding>

              <Padding b={1}>
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
              </Padding>

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
            <Button bsStyle="danger" onClick={this.notify.bind(null, 'danger')}>Danger NOTIFICATION</Button>
            <Button bsStyle="success" onClick={this.notify.bind(null, 'success')}>Success NOTIFICATION</Button>
          </Col>
        </Row>
      </Grid>
    </div>
    );
  }
});
