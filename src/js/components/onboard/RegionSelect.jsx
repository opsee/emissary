import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import {OnboardStore, AWSStore} from '../../stores';
import {OnboardActions} from '../../actions';
import {State} from 'react-router';
import {Link} from 'react-router';
import forms from 'newforms';
import {BoundField} from '../forms';
import _ from 'lodash';
import $q from 'q';
import router from '../../modules/router.js';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import colors from 'seedling/colors';
import {Padding} from '../layout';

let checkSubdomainPromise;
let domainPromisesArray = [];

const regions = AWSStore.getRegions();
const regionChoices = regions.map(r => {
  return [r.id, `${r.id} - ${r.name}`]
});

const InfoForm = forms.Form.extend({
  regions: forms.ChoiceField({
    choices: regionChoices,
    widget: forms.RadioSelect,
    widgetAttrs: {
      widgetType: 'RadioSelect'
    }
  }),
});

const Team = React.createClass({
  mixins: [State, OnboardStore.mixin],
  storeDidChange(){
    const data = OnboardStore.getInstallData();
    if (data && data.regions && data.regions.length){
      router.transitionTo('onboardCredentials');
    }
    const bastionStatus = OnboardStore.getGetBastionsStatus();
    if (bastionStatus == 'success'){
      const bastions = OnboardStore.getBastions();
      this.setState({bastions})
    }
  },
  getInitialState() {
    var self = this;
    var data = OnboardStore.getInstallData();
    const obj = {
      info: new InfoForm({
        onChange(){
          self.forceUpdate();
        },
        labelSuffix: '',
        data: {
          regions: data.regions
        },
        validation: {
          on: 'blur change',
          onChangeDelay: 100
        },
      }),
      bastions: []
    }
    setTimeout(function(){
      obj.info.validate();
    }, 10);
    return obj;
  },
  componentWillMount(){
    OnboardActions.getBastions();
  },
  submit(e){
    e.preventDefault();
    OnboardActions.onboardSetRegions(this.state.info.cleanedData.regions);
  },
  disabled(){
    return !this.state.info.cleanedData.regions || !this.state.info.cleanedData.regions.length;
  },
  toggleAll(value){
    if (value){
      this.state.info.updateData({
        regions: regions.map(r => {
          return r.id
        })
      })
    }else {
      this.state.info.updateData({regions: []});
    }
  },
  renderInner(){
    if (!this.state.bastions.length){
      return (
        <form name="loginForm" ng-submit="submit()" onSubmit={this.submit}>
         <p>Choose the region where you want to launch your Opsee Bastion Instance. The Bastion Instance will only be able to run health checks within this region.</p>
         {
         // <h2 className="h3">All AWS regions - <Button flat color="primary" onClick={this.toggleAll.bind(this, true)}>Select All</Button> - <Button flat color="warning"  onClick={this.toggleAll.bind(null, false)}>Deselect All</Button></h2>
         }
          <BoundField bf={this.state.info.boundField('regions')}/>
          <div><br/></div>
          <Button color="success" block type="submit" onClick={this.submit} disabled={this.disabled()} title={this.disabled() ? 'Choose a region to move on.' : 'Next'} chevron>Next</Button>
        </form>
      )
    }
    return (
      <Padding tb={1}>
        <Alert bsStyle="info">
          It looks like you already have a bastion in your environment. At this time, Opsee only supports one bastion.
        </Alert>
      </Padding>
    )
  },
  render() {
    return (
       <div>
        <Toolbar title="Choose a Region"/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderInner()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Team;