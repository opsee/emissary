import React from 'react';
import {Toolbar} from '../global';
import {OnboardStore, AWSStore} from '../../stores';
import {OnboardActions} from '../../actions';
import forms from 'newforms';
import {BoundField} from '../forms';
import router from '../../modules/router.js';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';
import {PageAuth} from '../../modules/statics';

const regions = AWSStore.getRegions();
const regionChoices = regions.map(r => {
  return [r.id, `${r.id} - ${r.name}`];
});

const InfoForm = forms.Form.extend({
  regions: forms.ChoiceField({
    choices: regionChoices,
    widget: forms.RadioSelect,
    widgetAttrs: {
      widgetType: 'RadioSelect'
    }
  })
});

const RegionSelect = React.createClass({
  mixins: [OnboardStore.mixin],
  statics: {
    willTransitionTo: PageAuth
  },
  getInitialState() {
    const self = this;
    const data = OnboardStore.getInstallData();
    const obj = {
      info: new InfoForm({
        onChange(){
          if (self.isMounted()){
            self.forceUpdate();
          }
        },
        labelSuffix: '',
        data: {
          regions: data.regions
        },
        validation: {
          on: 'blur change',
          onChangeDelay: 100
        }
      }),
      bastions: []
    };
    setTimeout(() => {
      obj.info.validate();
    }, 10);
    return obj;
  },
  componentWillMount(){
    OnboardActions.getBastions();
  },
  storeDidChange(){
    const bastionStatus = OnboardStore.getGetBastionsStatus();
    if (bastionStatus === 'success'){
      const bastions = OnboardStore.getBastions();
      if (this.isMounted()){
        this.setState({bastions});
      }
    }
  },
  isDisabled(){
    return !this.state.info.cleanedData.regions || !this.state.info.cleanedData.regions.length;
  },
  runToggleAll(value){
    if (value){
      this.state.info.updateData({
        regions: regions.map(r => {
          return r.id;
        })
      });
    }else {
      this.state.info.updateData({regions: []});
    }
  },
  handleSubmit(e){
    e.preventDefault();
    OnboardActions.onboardSetRegions(this.state.info.cleanedData.regions);
    //redo this later, make install be a parent page instead of this bull
    setTimeout(() => {
      router.transitionTo('onboardCredentials');
    }, 100);
  },
  renderInner(){
    if (!this.state.bastions.length){
      return (
        <form name="loginForm" onSubmit={this.handleSubmit}>
         <p>Choose the region where you want to launch your Opsee Bastion Instance. The Bastion Instance will only be able to run health checks within this region.</p>
         {
         // <h2 className="h3">All AWS regions - <Button flat color="primary" onClick={this.runToggleAll.bind(this, true)}>Select All</Button> - <Button flat color="warning"  onClick={this.runToggleAll.bind(null, false)}>Deselect All</Button></h2>
         }
          <BoundField bf={this.state.info.boundField('regions')}/>
          <Padding t={1}>
            <Button color="success" block type="submit" disabled={this.isDisabled()} title={this.isDisabled() ? 'Choose a region to move on.' : 'Next'} chevron>Next</Button>
          </Padding>
        </form>
      );
    }
    return (
      <Padding tb={1}>
        <Alert bsStyle="info">
          It looks like you already have a bastion in your environment. At this time, Opsee only supports one bastion.
        </Alert>
      </Padding>
    );
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

export default RegionSelect;