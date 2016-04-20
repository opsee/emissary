import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {bindActionCreators} from 'redux';
import {Toolbar} from '../global';
import {Button} from '../forms';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {onboard as actions, analytics as analyticsActions} from '../../actions';
import {RadioSelect} from '../forms';

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
    return {
      vpc: this.getSelectedVPC()
    };
  },
  getSelectedVPC(){
    const {onboard} = this.props.redux;
    const selected = _.chain(onboard.regionsWithVpcs)
    .head()
    .get('vpcs')
    .find({selected: true})
    .get('vpc_id')
    .value();
    const first = _.chain(onboard.vpcsForSelection)
    .head()
    .get('id')
    .value();
    return selected || first;
  },
  handleSelect(state){
    this.setState(state);
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.analyticsActions.trackEvent('Onboard', 'vpc-select');
    this.props.actions.vpcSelect(this.state.vpc);
  },
  renderInner(){
    if (this.props.redux.onboard.vpcsForSelection.length){
      return (
        <div>
          <p>Here are the active VPCs Opsee found in the regions you chose. Choose which VPC you&rsquo;d like to install our instance in.</p>
          <RadioSelect onChange={this.handleSelect} data={this.state} options={this.props.redux.onboard.vpcsForSelection} path="vpc"/>
          <Padding t={1}>
            <Button type="submit" color="success" block disabled={!this.state.vpc} chevron>Next</Button>
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