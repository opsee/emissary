import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {History, Link} from 'react-router';

import {bindActionCreators} from 'redux';
import {Toolbar} from '../global';
import {Button} from '../forms';
import {Heading} from '../type';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {onboard as actions, analytics as analyticsActions} from '../../actions';
import {RadioSelect} from '../forms';

const VPCSelect = React.createClass({
  mixins: [History],
  propTypes: {
    history: PropTypes.object,
    actions: PropTypes.shape({
      vpcSelect: PropTypes.func,
      scanRegion: PropTypes.func
    }),
    analyticsActions: PropTypes.shape({
      trackEvent: PropTypes.func
    }),
    redux: PropTypes.shape({
      onboard: PropTypes.shape({
        region: PropTypes.string,
        vpcsForSelection: PropTypes.array
      }),
      asyncActions: PropTypes.shape({
        onboardScanRegion: PropTypes.object
      }),
      user: PropTypes.object
    })
  },
  componentWillMount(){
    if (!this.props.redux.onboard.region) {
      this.props.history.replaceState(null, '/start/choose-region');
    }

    if (!this.props.redux.onboard.vpcsForSelection.length) {
      this.props.actions.scanRegion(this.props.redux.onboard.region);
    }
  },
  getInitialState() {
    return {
      vpc: this.getSelectedVPC()
    };
  },
  getVPCs() {
    return this.props.redux.onboard.vpcsForSelection.map(v => {
      let vpcID = _.get(v, 'vpc_id');
      let instanceCount = _.get(v, 'instance_count');
      return _.assign({}, v, {
        id: vpcID,
        label: `${vpcID} (${instanceCount} instances)`
      });
    });
  },
  getSelectedVPC(){
    // TODO grab from URL parameter if present
    const first = _.chain(this.props.redux.onboard.vpcsForSelection)
    .head()
    .get('vpc_id')
    .value();
    return first;
  },
  handleSelect(state){
    this.setState(state);
  },
  handleSubmit(e){
    e.preventDefault();
    // TODO get selected VPC
    this.props.actions.vpcSelect(this.state.vpc);
  },
  renderInner(){
    if (_.get(this.props.redux.asyncActions.onboardScanRegion, 'status') === 'pending') {
      return (
        <div>
          Scanning your {this.props.redux.onboard.region} environment for VPCs...
        </div>
      );
    } else if (this.props.redux.onboard.vpcsForSelection.length){
      return (
        <div>
          <p>Here are the active VPCs Opsee found in the regions you chose. Choose which VPC you&rsquo;d like to install our instance in.</p>
          <RadioSelect onChange={this.handleSelect} data={{vpc: this.state.vpc}} options={this.getVPCs()} path="vpc"/>
          <Padding t={1}>
            <Button type="submit" color="success" block disabled={!this.state.vpc} chevron>Select a subnet</Button>
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
              <Padding b={2}>
                <Heading level={3}>Your chosen region</Heading>
                <p>{this.props.redux.onboard.region} - <Link to="/start/choose-region">change region</Link></p>
              </Padding>

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