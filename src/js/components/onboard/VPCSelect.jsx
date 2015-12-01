import React from 'react';
import {connect} from 'react-redux';
import forms from 'newforms';
import _ from 'lodash';

import {bindActionCreators} from 'redux';
import {Toolbar} from '../global';
import {AWSStore} from '../../stores';
import {BoundField} from '../forms';
import analytics from '../../modules/analytics';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';
import {onboard as actions} from '../../reduxactions';

const regions = AWSStore.getRegions();

const InfoForm = forms.Form.extend({
  vpcs: forms.ChoiceField({
    widget: forms.RadioSelect,
    widgetAttrs: {
      widgetType: 'RadioSelect'
    }
  }),
  constructor(choices, kwargs){
    forms.Form.call(this, kwargs);
    this.fields.vpcs.setChoices(choices);
  }
});

const VPCSelect = React.createClass({
  componentWillMount(){
    if (!this.props.redux.onboard.regionsWithVpcs.length){
      this.props.history.replaceState(null, '/start/region-select');
    }
  },
  getInitialState() {
    const self = this;
    const obj = {
      info: new InfoForm(this.props.redux.onboard.vpcsForSelection, {
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
    return obj;
  },
  isDisabled(){
    return !this.state.info.cleanedData.vpcs;
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
    analytics.event('Onboard', 'vpc-select');
    this.props.actions.vpcSelect(this.state.info.cleanedData.vpcs);
  },
  renderInner(){
    if (this.props.redux.onboard.vpcsForSelection.length){
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

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(VPCSelect);