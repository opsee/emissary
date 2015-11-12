import React from 'react';
import _ from 'lodash';
import forms from 'newforms';

import {Padding} from '../layout';
import {Alert, Grid, Row, Col, Modal} from '../../modules/bootstrap';
import {Table, Toolbar, Loader, ListItemTest} from '../global';

import {CheckStore} from '../../stores';
import {GlobalActions} from '../../actions';

import {Add, Key} from '../icons';

import icons from '../icons';
import {Circle} from '../icons';
import {Button, BoundField, ToggleWithLabel} from '../forms';

const opseeColors = ['primary', 'success', 'info', 'warning', 'danger', 'error', 'gray50', 'gray100', 'gray200', 'gray300', 'gray400', 'gray500', 'gray600', 'gray700', 'gray800', 'gray900', 'text', 'textSecondary', 'header'];

function getState(){
  return {
    checks: CheckStore.getChecks(),
    toggles: [{on: true}, {on: false}, {on: true}],
    radios: _.range(3).map(i => {
      return {id: `radio-${i}`, on: false};
    }),
    buttonToggles: ['Cassandra', 'Consul', 'Docker Registry', 'Elasticsearch', 'Etcd', 'Influxdb', 'Memcached'].map((title, i) => {
      return {title: title, on: false, id: `button-toggle-${i}`};
    })
  };
}

const serviceChoices = ['Cassandra', 'Consul', 'Docker Registry', 'Elasticsearch', 'Etcd', 'Influxdb', 'Memcached', 'MongoDB', 'MySQL', 'Node', 'Postgres', 'RDS', 'Redis', 'Riak', 'Zookeeper'];

const InfoForm = forms.Form.extend({
  name: forms.CharField({
    widgetAttrs: {
      placeholder: 'Name',
      autoComplete: 'off',
      title: 'foo'
    }
  }),
  password: forms.CharField({
    widgetAttrs: {
      placeholder: 'Password'
    }
  }),
  body: forms.CharField({
    widget: forms.Textarea,
    widgetAttrs: {
      placeholder: 'Body'
    }
  }),
  services: forms.MultipleChoiceField({
    choices: serviceChoices.slice(0, 6).map(s => [s, s]),
    widget: forms.CheckboxSelectMultiple(),
    widgetAttrs: {
      widgetType: 'MultiButtonToggle'
    },
    label: 'buttonToggle'
  }),
  radio: forms.ChoiceField({
    choices: serviceChoices.slice(0, 5).map(s => [s, s]),
    widget: forms.RadioSelect,
    widgetAttrs: {
      widgetType: 'RadioSelect'
    }
  }),
  validation: 'auto'
});

export default React.createClass({
  mixins: [CheckStore.mixin],
  getInitialState(){
    const self = this;
    return _.extend(getState(), {
      info: new InfoForm({
        onChange(){
          if (self.isMounted()){
            self.forceUpdate();
          }
        }
      }),
      showMenu: false
    });
  },
  storeDidChange() {
    this.setState(getState());
  },
  getDefaultProps() {
    return getState();
  },
  getColor(index){
    return opseeColors[index % opseeColors.length];
  },
  getChecks(){
    return false;
  },
  runTriggerToggle(index, bool){
    let toggles = this.state.toggles;
    toggles[index].on = bool;
    this.setState({toggles});
  },
  runTriggerRadio(id, bool){
    let radios = _.clone(this.state.radios);
    const index = _.findIndex(radios, {id});
    if (index > -1){
      radios = radios.map(r => {
        r.on = r.id === id ? bool : false;
        return r;
      });
      this.setState({radios});
    }
  },
  runTriggerButtonToggle(id, bool){
    let buttonToggles = _.clone(this.state.buttonToggles);
    const index = _.findIndex(buttonToggles, {id});
    if (index > -1){
      buttonToggles = buttonToggles.map(r => {
        r.on = r.id === id ? bool : r.on;
        return r;
      });
      this.setState({buttonToggles});
    }

    // let buttonToggles = this.state.buttonToggles
    // buttonToggles[index].on = bool;
    // this.setState({buttonToggles});
  },
  runNotify(style){
    console.log(`run notify ${style}`);
    GlobalActions.globalModalMessage({
      html: 'This is a test of the notification system, <a href="http://google.com" target="_blank">even including html</a>',
      style: style
    });
  },
  runToggleContextMenu(){
    this.setState({showMenu: !this.state.showMenu});
  },
  render() {
    return (
      <div>
        <Toolbar title="Opsee Styleguide">
          <Button fab color="primary" title="Primary Action" tooltip="A Test Button" tooltip-placement="left">
            <Add btn/>
          </Button>
        </Toolbar>

        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={1}>
                <h3>Fab button (at top right)</h3>
                <p>To be used as the primary action on application pages that have CRUD functionality. For example, in a list of health checks to add a new check, or on a profile page to edit the user profile. On screens like the tutorial with Next as the primary action, a Fab should not be used.</p>
                <p>Additionally, color can be used to help communicate the purpose of the buton. Primary color for Add and Info color for Edit actions are standard across the app.</p>
              </Padding>

              <Padding b={1}>
                <h3>Colors</h3>
                {opseeColors.map(color => {
                  return (
                    <Row className="flex-vertical-align" key={`color-list-${color}`}>
                      <Col>
                        <Circle fill={color} style={{width: '40px', height: '40px'}}/>
                      </Col>
                      <Col style={{margin: '0 0 0 0.5rem'}}>
                        {color}
                      </Col>
                    </Row>
                  );
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
                  {Object.keys(icons).map((key, i) => {
                    return React.createElement(icons[key], {fill: this.getColor(i), key: `icon-${i}`});
                  })}
                </div>
              <hr/>

              <Padding b={1}>

                  <h3>Unordered List</h3>
                  <ul>
                  {[1, 2, 3, 4].map(i => {
                    return (
                      <li key={`unordered-item-${i}`}>List Item {i}</li>
                    );
                  })}
                  </ul>

                  <h3>Ordered List</h3>
                  <ol>
                    {[1, 2, 3, 4].map(i => {
                      return (
                      <li key={`ordered-item-${i}`}>List Item {i}</li>
                      );
                    })}
                  </ol>
                </Padding>

                <h3>Toggle List</h3>
                <ul className="list-unstyled">
                {this.state.toggles.map((t, i) => {
                  return (
                    <li key={`toggle-${i}`}>
                      <ToggleWithLabel on={t.on} onChange={this.runTriggerToggle} id={`toggle-${i}`} label="Item"/>
                    </li>
                  );
                })}
                </ul>
              </Padding>

              <hr/>

              <h3>Radio Select</h3>
              <BoundField bf={this.state.info.boundField('radio')}/>
              <hr/>

          <h3>Button Toggles</h3>
          <BoundField bf={this.state.info.boundField('services')}/>
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

            <h3>List Items</h3>
            <ListItemTest state="passing" passing={2} total={2}/>
            <ListItemTest state="failing" passing={1} total={2}/>
            <ListItemTest state="running"/>

            <hr/>

            <h3>Cards</h3>
            <Row>
            {[1, 2, 3, 4].map(i => {
              return (
                <Col xs={12} sm={6} key={`card-${i}`}>
                  <Padding tb={1}>
                    <div className="bg-gray-900 md-shadow-bottom-z-1">
                      <div className="padding">
                        <h2 className="margin-none">A title goes here</h2>
                        <div>
                          <div><a href="mailto:">test@opsee.co</a></div>
                          <span>#352346 - Created on 12/05/15</span>
                        </div>
                      </div>
                      <div>
                        <Button color="default" flat>Delete</Button>
                        <Button color="primary" flat className="pull-right">Activate</Button>
                      </div>
                    </div>
                  </Padding>
                </Col>
              );
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

              <h3>Buttons</h3>
              <Padding b={2}>
                <p><strong>Regular:</strong></p>
                <p>Regular button styles are used less often than Flat buttons. Regular buttons can be used for primary actions on pages where it is not appropriate to use a Fab (use block styling as well in this case), such as the tutorial, of for form submission</p>
                <p>Submitting a form uses the Success color.</p>
                <p>
                {['primary', 'success', 'warning', 'danger', 'info', 'default'].map(i => {
                  return (
                    <Button color={i} key={`btn-${i}`}>{i}</Button>
                  );
                })}
                </p>

                <p><strong>Disabled:</strong></p>
                <p>
                {['primary', 'success', 'warning', 'danger', 'info', 'default'].map(i => {
                  return (
                    <Button color={i} disabled key={`btn-${i}`}>{i}</Button>
                  );
                })}
                </p>
                <Padding t={2}>
                  <Button block>Block</Button>
                </Padding>
              </Padding>

              <h3>Flat Buttons</h3>
              <p>Flat buttons are the workhorses of the app. They are the most common button style, used for secondary actions on any page, like Adding a check to an existing group on its detail page or Logging Out on the profile page.</p>
              <p>Flat buttons are also used in the context menu actions, and when combined with Block styling they lose their border.</p>
              <p>"Positive" actions such as creating a check will typically use the Primary color, while negative actions like deleting or logging out will use the Danger color.</p>
              <Padding b={2}>
                {['primary', 'success', 'warning', 'danger', 'info', 'default'].map(i => {
                  return (
                    <Padding className="pull-left" key={`btn-flat-${i}`}>
                      <Button flat color={i}>{i}</Button>
                    </Padding>
                  );
                })}
                <Padding t={1}>
                  <Button flat color="success" disabled>Disabled</Button>
                </Padding>
              </Padding>
              <Padding b={2}>
                <Button flat noPad primary>NO PAD</Button>
              </Padding>
            </form>

            <h3>Alerts</h3>
            <Padding b={2}>
              {['primary', 'success', 'warning', 'danger', 'info', 'default'].map(i => {
                return (
                  <Alert bsStyle={i} onDismiss={_.noop} key={`alert-${i}`}>A great alert goes here.</Alert>
                  );
              })}
            </Padding>

            <h3>Loading State</h3>
            <Loader/>
            <h3>Context Menu</h3>
            <Button onClick={this.runToggleContextMenu} color="primary">Toggle</Button>
            <Modal show={this.state.showMenu} onHide={this.runToggleContextMenu} className="context" style="default">
              <Grid fluid>
                <Row>
                  <div className="flex-1">
                    <Padding lr={1}>
                      <h3>Actions</h3>
                    </Padding>
                    <Button text="left" color="primary" block flat>
                      <Add inline fill="primary"/> Add Item
                    </Button>
                  </div>
                </Row>
              </Grid>
            </Modal>
            <h3>Global Notifcations</h3>
            <Padding b={1}>
              <Button color="danger" onClick={this.runNotify.bind(null, 'danger')}>Danger NOTIFICATION</Button>
            </Padding>
            <Padding b={1}>
              <Button color="success" onClick={this.runNotify.bind(null, 'success')}>Success NOTIFICATION</Button>
            </Padding>
          </Col>
        </Row>
      </Grid>
    </div>
    );
  }
});
