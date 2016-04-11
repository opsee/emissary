import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import forms from 'newforms';

import {bindActionCreators} from 'redux';
import {StatusHandler, Toolbar} from '../global';
import img from '../../../img/tut-subnets.svg';
import {BoundField} from '../forms';
import {Button} from '../forms';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {Heading} from '../type';
import {onboard as actions, analytics as analyticsActions} from '../../actions';

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
    analyticsActions: PropTypes.shape({
      trackEvent: PropTypes.func
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
    const newImg = new Image();
    newImg.src = img;
    newImg.onload = () => {
      if (this.isMounted()){
        this.setState({
          loaded: true
        });
      }
    };
  },
  getInitialState() {
    const self = this;
    const data = this.props.redux.onboard.subnetsForSelection;
    let obj = {};
    if (data.length){
      obj = {
        loaded: false,
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
    this.props.analyticsActions.trackEvent('Onboard', 'subnet-select');
    this.props.actions.subnetSelect(this.state.info.cleanedData.subnets);
  },
  renderInner(){
    if (!this.state.loaded){
      return <StatusHandler status="pending"/>;
    } else if (this.props.redux.onboard.subnetsForSelection.length){
      return (
        <div>
          <Padding b={1}>
            <p>Choose a Subnet to install your instance in. The instance needs to communicate with both Opsee and any private subnets you want to check.  If you're not sure which subnet to choose, we've selected the one we think is the best fit.</p>
          </Padding>
          <Grid>
            <Row>
              <Col xs={12} sm={4}>
                <img src={img}/>

              </Col>
              <Col xs={12} sm={8}>
                <Heading level={3}>Your Subnets</Heading>
                <BoundField bf={this.state.info.boundField('subnets')}/>
              </Col>
            </Row>
          </Grid>
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
  actions: bindActionCreators(actions, dispatch),
  analyticsActions: bindActionCreators(analyticsActions, dispatch)
});

export default connect(null, mapDispatchToProps)(SubnetSelect);