import React, {PropTypes} from 'react';
import {History} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Toolbar} from '../global';
import {Button} from '../forms';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {Heading} from '../type';
import {onboard as actions} from '../../actions';
import config from '../../modules/config';
import regions from '../../modules/regions';
import {RadioSelect} from '../forms';
import {NewWindow} from '../icons';

const RegionSelect = React.createClass({
  mixins: [History],
  propTypes: {
    actions: PropTypes.shape({
      setRegion: PropTypes.func
    }),
    redux: PropTypes.shape({
      env: PropTypes.shape({
        bastions: PropTypes.array
      }),
      onboard: PropTypes.shape({
        regionLaunchURL: PropTypes.string
      })
    })
  },
  componentWillReceiveProps(nextProps) {
    const thisURL = _.get(this.props.redux, 'onboard.regionLaunchURL');
    const nextURL = _.get(nextProps.redux, 'onboard.regionLaunchURL');

    if (this.state.region && thisURL !== nextURL) {
      const formattedURL = _.replace(nextURL, '${region}', this.state.region);
      window.open(this.history.createHref(formattedURL));
      this.history.pushState(null, `/s/add-instance?region=${this.state.region}`);
    }
  },
  getInitialState() {
    return {
      region: null
    };
  },
  handleSelect(region){
    this.setState({ region });
    this.props.actions.makeLaunchRoleUrlTemplate();
  },
  renderRegions(){
    let templateStatus = _.get(this.props.redux.asyncActions, 'onboardMakeLaunchTemplate.status');
    let isPending = templateStatus === 'pending';

    return regions.map((region, i) => {
      let regionID = _.get(region, 'id');
      let boundClick = this.handleSelect.bind(null, regionID);
      let isLoading = isPending && regionID === this.state.region;
      let buttonText = isLoading ? 'Launching...' : 'Launch stack';
      return (
        <Row key={i}>
          <Col xs={8}>
            <div>{regionID}</div>
            <div>
              <small className="text-muted">{_.get(region, 'name')}</small>
            </div>
          </Col>
          <Col xs={4}>
            <Button onClick={boundClick} color="warning" disabled={isPending} flat secondary>{buttonText}</Button>
          </Col>
        </Row>
      );
    });
  },
  renderInner(){
    if (!_.find(this.props.redux.env.bastions, 'connected')){
      return (
        <div>
          <p>It's time to launch our CloudFormation stack. This will launch the AWS console.
          Choose a region by clicking one of the buttons below.
          When you're finished, come back to Opsee to continue installation.</p>

          <Heading level={2}>What to do in the AWS Console</Heading>
          <p>Here's the TLDR version of what to do in your AWS console:</p>
          <p><strong>Click Next 3 times, then check the "acknowledge" box, and click Create.</strong></p>
          <p>See all the details in our install documentation. If you have any
          trouble here, reach out to us any time at <a href="mailto:support@opsee.co">support@opsee.com</a>.</p>

          {this.renderRegions()}
        </div>
      );
    }
    return (
      <Padding tb={1}>
        <Alert color="info">
          It looks like you already have an instance in your environment.
          At this time, Opsee only supports one instance per customer.
          If you need more, please <a href="mailto:support@opsee.co">contact us</a>.
        </Alert>
      </Padding>
    );
  },
  render() {
    console.log(this.props.redux.asyncActions.onboardMakeLaunchTemplate);
    return (
       <div>
        <Toolbar title="Choose a Region"/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderInner()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RegionSelect);