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
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import colors from 'seedling/colors';

let checkSubdomainPromise;
let domainPromisesArray = [];

const regions = AWSStore.getRegions();
const regionChoices = regions.map(r => {
  return [r.id, `${r.id} - ${r.name}`]
});

const InfoForm = forms.Form.extend({
  regions: forms.ChoiceField({
    choices: regionChoices,
    widget: forms.RadioSelect
  }),
});

const Team = React.createClass({
  mixins: [State, OnboardStore.mixin],
  storeDidChange(){
    const data = OnboardStore.getInstallData();
    if(data && data.regions && data.regions.length){
      router.transitionTo('onboardCredentials');
    }
  },
  getInitialState() {
    var self = this;
    var data = OnboardStore.getInstallData();
    const obj = {
      info:new InfoForm({
        onChange(){
          self.forceUpdate();
        },
        labelSuffix:'',
        data: {
          regions:data.regions
        },
        validation:{
          on:'blur change',
          onChangeDelay:100
        },
      })
    }
    setTimeout(function(){
      obj.info.validate();
    },10);
    return obj;
  },
  submit(e){
    e.preventDefault();
    OnboardActions.onboardSetRegions(this.state.info.cleanedData.regions);
  },
  disabled(){
    return !this.state.info.cleanedData.regions || !this.state.info.cleanedData.regions.length;
  },
  toggleAll(value){
    if(value){
      this.state.info.updateData({
        regions:regions.map(r => {
          return r.id
        })
      })
    }else{
      this.state.info.updateData({regions:[]});
    }
  },
  render() {
    return (
       <div>
        <Toolbar title="Choose a Region"/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <form name="loginForm" ng-submit="submit()" onSubmit={this.submit}>
               <p>Choose the region where you want to launch your Opsee Bastion Instance. The Bastion Instance will only be able to run health checks within this region.</p>
               {
               // <h2 className="h3">All AWS regions - <button type="button" className="btn btn-flat btn-primary" onClick={this.toggleAll.bind(this, true)}>Select All</button> - <button type="button" className="btn btn-flat btn-warning" onClick={this.toggleAll.bind(null, false)}>Deselect All</button></h2>
               }
                <BoundField bf={this.state.info.boundField('regions')}/>
                <div><br/></div>
                <Button bsStyle="success" block={true} type="submit" onClick={this.submit} disabled={this.disabled()} title={this.disabled() ? 'Choose a region to move on.' : 'Next'} chevron={true}>Next</Button>
              </form>
              {
              // <pre>{JSON.stringify(this.state.info.cleanedData, null, ' ')}</pre>
              }
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Team;