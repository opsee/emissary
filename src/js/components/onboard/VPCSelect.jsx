import React from 'react';
import {Toolbar} from '../global';
import {OnboardStore, AWSStore} from '../../stores';
import {OnboardActions} from '../../actions';
import forms from 'newforms';
import {BoundField} from '../forms';
import _ from 'lodash';
import router from '../../modules/router';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';

const regions = AWSStore.getRegions();

const InfoForm = forms.Form.extend({
  vpcs: forms.ChoiceField({
    choices: [],
    widget: forms.RadioSelect,
    widgetAttrs: {
      widgetType: 'RadioSelect'
    }
  })
});

const Team = React.createClass({
  mixins: [OnboardStore.mixin],
  statics: {
    willTransitionTo(transition){
      const data = OnboardStore.getInstallData();
      const dataHasValues = _.chain(data).values().every(_.identity).value();
      if (!dataHasValues || !data.regions.length){
        transition.redirect('onboardRegionSelect');
      }
    }
  },
  storeDidChange(){
    this.runSetVpcs();
    const data = OnboardStore.getInstallData();
    const dataHasValues = _.chain(data).values().every(_.identity).value();
    if (dataHasValues && data.regions.length && data.vpcs.length){
      // OnboardActions.onboardSetVpcs()
      router.transitionTo('onboardInstall');
    }
  },
  getInitialState() {
    const self = this;
    const obj = {
      info: new InfoForm({
        onChange(){
          self.forceUpdate();
        },
        labelSuffix: '',
        validation: {
          on: 'blur change',
          onChangeDelay: 100
        }
      })
    };
    return _.extend(obj, {
      status: 'pending',
      vpcs: []
    });
  },
  isDisabled(){
    return !this.state.info.cleanedData.vpcs;
  },
  runSetVpcs(){
    const regionsWithVpcs = OnboardStore.getAvailableVpcs();
    if (regionsWithVpcs.length){
      let vpcs = regionsWithVpcs.map(r => {
        return r.vpcs.map(v => {
          let name = v['vpc-id'];
          if (v.tags){
            let nameTag = _.findWhere(v.tags, {key: 'Name'});
            if (nameTag){
              name = `${nameTag.value} - ${v['vpc-id']}`;
            }
          }
          return [v['vpc-id'], `${name} (${r.region})`];
        });
      });
      vpcs = _.flatten(vpcs);
      this.state.info.fields.vpcs.setChoices(vpcs);
      this.setState({vpcs: vpcs});
    }
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
    OnboardActions.onboardSetVpcs(this.state.info.cleanedData.vpcs);
  },
  renderInner(){
    if (this.state.vpcs.length){
      return (
        <div>
          <p>Here are the active VPCs Opsee found in the regions you chose. Choose which VPC you&rsquo;d like to install a Bastion in.</p>
          <BoundField bf={this.state.info.boundField('vpcs')}/>
          <Padding t={1}>
            <Button type="submit" color="success" block disabled={this.isDisabled()}>Install</Button>
          </Padding>
        </div>
      );
    }
    return (
      <Alert type="danger">
        Either you have no active VPCs or something else went wrong.
      </Alert>
    );
  },
  render() {
    return (
       <div>
        <Toolbar title="Select a VPC"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <form name="loginForm" onSubmit={this.handleSubmit}>
              {this.renderInner()}
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Team;