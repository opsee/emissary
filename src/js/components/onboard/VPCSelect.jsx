import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import forms from 'newforms';

import {bindActionCreators} from 'redux';
import {Toolbar} from '../global';
import {BoundField} from '../forms';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';
import {onboard as actions, analytics as analyticsActions} from '../../actions';

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
      vpcSelect: PropTypes.func
    }),
    analyticsActions: PropTypes.shape({
      trackEvent: PropTypes.func
    }),
    redux: PropTypes.shape({
      onboard: PropTypes.shape({
        regionsWithVpcs: PropTypes.array,
        vpcsForSelection: PropTypes.array
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
    let obj = {};
    const data = this.props.redux.onboard.vpcsForSelection;
    if (data.length){
      obj = {
        info: new InfoForm(data, {
          onChange(){
            self.forceUpdate();
          },
          labelSuffix: '',
          validation: {
            on: 'blur change',
            onChangeDelay: 100
          },
          data: {
            vpcs: [data[0][0]]
          }
        })
      };
      setTimeout(() => {
        obj.info.validate();
      }, 30);
    }
    return obj;
  },
  isDisabled(){
    return !this.state.info.cleanedData.vpcs;
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.analyticsActions.trackEvent('Onboard', 'vpc-select');
    this.props.actions.vpcSelect(this.state.info.cleanedData.vpcs);
  },
  renderInner(){
    if (this.props.redux.onboard.vpcsForSelection.length){
      return (
        <div>
          <p>Here are the active VPCs Opsee found in the regions you chose. Choose which VPC you&rsquo;d like to install a Bastion in.</p>
          <BoundField bf={this.state.info.boundField('vpcs')}/>
          <Padding t={1}>
            <Button type="submit" color="success" block disabled={this.isDisabled()} chevron>Next</Button>
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
  actions: bindActionCreators(actions, dispatch),
  analyticsActions: bindActionCreators(analyticsActions, dispatch)
});

export default connect(null, mapDispatchToProps)(VPCSelect);