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
import {RadioSelect} from '../forms2';

const SubnetSelect = React.createClass({
  propTypes: {
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
    }),
    history: PropTypes.shape({
      pushState: PropTypes.func,
      replaceState: PropTypes.func
    }).isRequired
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
    return {
      subnet: this.getSelectedSubnet()
    };
  },
  getSelectedSubnet(){
    const {onboard} = this.props.redux;
    const selected = _.chain(onboard.regionsWithVpcs)
    .head()
    .get('subnets')
    .find({selected: true})
    .get('subnet_id')
    .value();
    const first = _.chain(onboard.subnetsForSelection)
    .head()
    .get('id')
    .value();
    return selected || first;
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
                <RadioSelect onChange={this.handleSelect} data={this.state} options={this.props.redux.onboard.subnetsForSelection} path="subnet"/>
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