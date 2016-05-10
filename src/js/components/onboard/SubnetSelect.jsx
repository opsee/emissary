import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import _ from 'lodash';
import {plain as seed} from 'seedling';

import {bindActionCreators} from 'redux';
import {StatusHandler, ProgressBar, Toolbar} from '../global';
import img from '../../../img/tut-subnets.svg';
import {Button} from '../forms';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {Heading} from '../type';
import {onboard as actions, analytics as analyticsActions} from '../../actions';
import {RadioSelect} from '../forms';
import style from './onboard.css';

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
        region: PropTypes.string,
        subnetsForSelection: PropTypes.array,
        selectedVPC: PropTypes.string,
        selectedSubnet: PropTypes.string
      }),
      asyncActions: PropTypes.shape({
        envGetBastions: PropTypes.object,
        onboardScanRegion: PropTypes.object
      }),
      user: PropTypes.object
    }),
    history: PropTypes.shape({
      pushState: PropTypes.func,
      replaceState: PropTypes.func
    }).isRequired
  },
  componentWillMount(){
    if (!this.props.redux.onboard.region) {
      this.props.history.replaceState(null, '/start/choose-region');
    }
    if (!this.props.redux.onboard.selectedVPC) {
      this.props.history.replaceState(null, '/start/choose-vpc');
    }
    if (!this.props.redux.onboard.subnetsForSelection.length) {
      this.props.actions.scanRegion(this.props.redux.onboard.region);
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
    this.props.actions.subnetSelect(this.getSelectedSubnet());
  },
  getInitialState() {
    return {
      subnet: this.getSelectedSubnet()
    };
  },
  getSubnets() {
    return _.filter(this.props.redux.onboard.subnetsForSelection, s => {
      return s.vpc_id === this.props.redux.onboard.selectedVPC;
    });
  },
  getSelectedSubnet(){
    if (this.props.redux.onboard.selectedSubnet) {
      return this.props.redux.onboard.selectedSubnet;
    }
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
    const subnets = this.getSubnets().map(s => {
      let subnetID = _.get(s, 'subnet_id');
      let labelName = s.name ? `<strong>${s.name}</strong> - ` : '';
      return _.assign({}, s, {
        id: subnetID,
        label: `${labelName}${subnetID}<br/><small>(${_.get(s, 'instance_count')} instances, ${_.get(s, 'routing')} routing)</small>`
      });
    });
    return (
      <div>
        <Padding b={1}>
          <p>Choose a Subnet to install your instance in. The instance needs to communicate with both Opsee and any private subnets you want to check.  If you're not sure which subnet to choose, we've selected the one we think is the best fit.</p>
        </Padding>
        <Grid>
          <Row>
            <Col xs={12} sm={5} className="text-center">
              <Padding a={2}>
                <img src={img} style={{maxWidth: '350px', width: '100%'}}/>
              </Padding>
            </Col>
            <Col xs={12} sm={7}>
              <Padding tb={1}>
                <Heading level={3}>Your Subnets</Heading>
                <RadioSelect onChange={this.handleSelect} data={this.state} options={subnets} path="subnet"/>
              </Padding>
            </Col>
          </Row>
        </Grid>
        <Padding t={1}>
          <Button type="submit" color="success" block disabled={this.isDisabled()} chevron>Install</Button>
        </Padding>
      </div>
    );
  },
  render() {
    return (
       <div>
        <Toolbar title="Step 2: Select a Subnet" className={style.toolbar} />
        <Padding b={2}>
          <ProgressBar percentage={75} color={seed.color.success} flat />
        </Padding>

        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={2}>
                <Heading level={3}>Your chosen region</Heading>
                <p>{this.props.redux.onboard.region} - <Link to="/start/choose-region">change region</Link></p>

                <Heading level={3}>Your chosen VPC</Heading>
                <p>{this.props.redux.onboard.selectedVPC} - <Link to="/start/choose-vpc">change VPC</Link></p>
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