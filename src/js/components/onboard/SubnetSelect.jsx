import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import forms from 'newforms';

import {bindActionCreators} from 'redux';
import {Toolbar} from '../global';
import {BoundField} from '../forms';
import analytics from '../../modules/analytics';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';
import {onboard as actions} from '../../reduxactions';

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
  propTypes: {
    history: PropTypes.object,
    actions: PropTypes.shape({
      subnetSelect: PropTypes.func
    }),
    redux: PropTypes.shape({
      onboard: PropTypes.shape({
        regionsWithVpcs: PropTypes.array,
        subnetsForSelection: PropTypes.array
      }),
      asyncActions: PropTypes.shape({
        envGetBastions: PropTypes.object
      }),
      user: PropTypes.object
    })
  },
  componentWillMount(){
    if (!this.props.redux.onboard.regionsWithVpcs.length){
      this.props.history.replaceState(null, '/start/region-select');
    }
  },
  getInitialState() {
    const self = this;
    const obj = {
      info: new InfoForm(this.props.redux.onboard.subnetsForSelection, {
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
  handleSubmit(e){
    e.preventDefault();
    analytics.event('Onboard', 'subnet-select');
    this.props.actions.subnetSelect(this.state.info.cleanedData.vpcs);
  },
  renderInner(){
    if (this.props.redux.onboard.subnetsForSelection.length){
      return (
        <div>
          <p>Choose which Subnet you&rsquo;d like to install a Bastion in.</p>
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
        <Toolbar title="Select a Subnet"/>
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