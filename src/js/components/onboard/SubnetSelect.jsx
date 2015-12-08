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
  subnets: forms.ChoiceField({
    widget: forms.RadioSelect,
    widgetAttrs: {
      widgetType: 'RadioSelect'
    }
  }),
  constructor(choices, kwargs){
    forms.Form.call(this, kwargs);
    this.fields.subnets.setChoices(choices);
  }
});

const SubnetSelect = React.createClass({
  propTypes: {
    history: PropTypes.object,
    actions: PropTypes.shape({
      subnetSelect: PropTypes.func
    }),
    redux: PropTypes.shape({
      onboard: PropTypes.shape({
        subnetsForSelection: PropTypes.array
      }),
      asyncActions: PropTypes.shape({
        envGetBastions: PropTypes.object
      }),
      user: PropTypes.object
    })
  },
  componentWillMount(){
    if (!this.props.redux.onboard.subnetsForSelection.length){
      this.props.history.replaceState(null, '/start/region-select');
    }
  },
  getInitialState() {
    const self = this;
    const data = this.props.redux.onboard.subnetsForSelection;
    let obj = {};
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
            subnets: [data[0][0]]
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
    return !this.state.info.cleanedData.subnets;
  },
  handleSubmit(e){
    e.preventDefault();
    analytics.event('Onboard', 'subnet-select');
    this.props.actions.subnetSelect(this.state.info.cleanedData.subnets);
  },
  renderInner(){
    if (this.props.redux.onboard.subnetsForSelection.length){
      return (
        <div>
          <p>Choose which Subnet you&rsquo;d like to install a Bastion in.</p>
          <BoundField bf={this.state.info.boundField('subnets')}/>
          <Padding t={1}>
            <Button type="submit" color="success" block disabled={this.isDisabled()}>Install</Button>
          </Padding>
        </div>
      );
    }
    return (
      <Alert type="danger">
        Either you have no active Subnets or something else went wrong.
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

export default connect(null, mapDispatchToProps)(SubnetSelect);