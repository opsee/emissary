import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {bindActionCreators} from 'redux';
import {StatusHandler, Toolbar} from '../global';
import img from '../../../img/tut-subnets.svg';
import {Button} from '../forms';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {Heading} from '../type';
import {onboard as actions, analytics as analyticsActions} from '../../actions';
import {RadioSelect} from '../forms';

const SubnetSelect = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      scanRegion: PropTypes.func,
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
        envGetBastions: PropTypes.object,
        onboardScanRegion: PropTypes.object
      }),
      user: PropTypes.object
    }),
    location: PropTypes.shape({
      query: PropTypes.shape({
        region: PropTypes.string.isRequired,
        vpc: PropTypes.string.isRequired
      })
    }),
    history: PropTypes.shape({
      pushState: PropTypes.func,
      replaceState: PropTypes.func
    }).isRequired
  },
  componentWillMount(){
    const region = this.props.location.query.region;
    if (!region) {
      this.props.history.replaceState(null, '/start/choose-region');
    }

    const vpc = this.props.location.query.vpc;
    if (!vpc) {
      this.props.history.replaceState(null, `/start/choose-vpc?region=${region}`);
    }

    if (!this.props.redux.onboard.subnetsForSelection.length) {
      this.props.actions.scanRegion(region);
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
    // this.props.actions.subnetSelect(this.getSelectedSubnet());
  },
  getInitialState() {
    return {
      subnet: this.getSelectedSubnet()
    };
  },
  getSubnets() {
    return this.props.redux.onboard.subnetsForSelection;
  },
  getSelectedSubnet(){
    const first = _.chain(this.getSubnets())
    .head()
    .get('subnet_id')
    .value();
    return first;
  },
  isDisabled(){
    return !this.state.subnet;
  },
  handleSelect(state){
    this.setState(state);
    this.props.actions.subnetSelect(state.subnet);
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.history.pushState(null, '/start/install');
  },
  renderInner(){
    if (_.get(this.props.redux.asyncActions.onboardScanRegion, 'status') === 'pending') {
      return <StatusHandler status="pending"/>;
    } else if (!this.props.redux.onboard.subnetsForSelection.length){
      return (
        <Alert type="danger">
          Either you have no active Subnets or something else went wrong.
        </Alert>
      );
    }
    const subnets = this.props.redux.onboard.subnetsForSelection.map(s => {
      let subnetID = _.get(s, 'subnet_id');
      let instanceCount = _.get(s, 'instance_count');
      return _.assign({}, s, {
        id: subnetID,
        label: `${subnetID} (${instanceCount} instances)`
      });
    });
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
              <RadioSelect onChange={this.handleSelect} data={this.state} options={subnets} path="subnet"/>
            </Col>
          </Row>
        </Grid>
        <Padding t={1}>
          <Button type="submit" color="success" block disabled={this.isDisabled()}>Install</Button>
        </Padding>
      </div>
    );
  },
  render() {
    return (
       <div>
        <Toolbar title="Select a Subnet"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={2}>
                <Heading level={3}>Your chosen region</Heading>
                <p>{this.props.location.query.region}</p>

                <Heading level={3}>Your chosen VPC</Heading>
                <p>{this.props.location.query.vpc}</p>
              </Padding>
            </Col>
          </Row>
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