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
import regions from '../../modules/regions';
import {SetInterval} from '../../modules/mixins';

const RegionSelect = React.createClass({
  mixins: [History, SetInterval],
  propTypes: {
    actions: PropTypes.shape({
      hasRole: PropTypes.func,
      makeLaunchRoleUrlTemplate: PropTypes.func,
      setRegion: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        onboardMakeLaunchTemplate: PropTypes.object
      }),
      env: PropTypes.shape({
        bastions: PropTypes.array
      }),
      onboard: PropTypes.shape({
        hasRole: PropTypes.bool,
        regionLaunchURL: PropTypes.string
      })
    })
  },
  componentWillMount(){
    if (!this.getTemplateURL()) { // TODO clear this between onboarding somehow
      this.props.actions.makeLaunchRoleUrlTemplate();
    }
  },
  componentDidMount() {
    this.setInterval(() => {
      this.props.actions.hasRole();
    }, 1000 * 5); // every 5 seconds
  },
  componentWillReceiveProps(){
    if (this.props.redux.onboard.hasRole && this.state.isPolling) {
      this.history.pushState(null, '/start/add-instance');
    }
  },
  getInitialState() {
    return {
      // technically, we are always polling in the background
      isPolling: false,
      region: null
    };
  },
  getTemplateURL(region) {
    const urlTemplate = _.get(this.props.redux, 'onboard.regionLaunchURL');
    return region ? _.replace(urlTemplate, '${region}', region) : urlTemplate;
  },
  handleSelect(region){
    this.props.actions.setRegion(region);
    this.setState({ region,
      isPolling: true
    });
  },
  renderRegions(){
    const templateStatus = _.get(this.props.redux.asyncActions, 'onboardMakeLaunchTemplate.status');
    if (templateStatus === 'pending') {
      return (
        <div>
          Scanning your AWS environment...
        </div>
      );
    }
    return regions.map((region, i) => {
      let regionID = _.get(region, 'id');
      let boundClick = this.handleSelect.bind(null, regionID);
      let url = this.props.redux.onboard.hasRole ? null : this.getTemplateURL(regionID);
      return (
        <Row key={i}>
          <Col xs={8}>
            <div>{regionID}</div>
            <div>
              <small className="text-muted">{_.get(region, 'name')}</small>
            </div>
          </Col>
          <Col xs={4}>
            <Button onClick={boundClick} to={url} target="_blank" color="warning" flat secondary>Launch stack</Button>
          </Col>
        </Row>
      );
    });
  },
  renderInstructions() {
    return (
      <div>
        <Heading level={2}>What to do in the AWS Console</Heading>
        <p>Here&rsquo;s the TLDR version of what to do in your AWS console:</p>
        <p><strong>Click Next 3 times, then check the "acknowledge" box, and click Create.</strong></p>
        <p>See all the details in <a href="/docs/IAM" target="_blank">our install documentation</a>. If you have any
        trouble here, reach out to us any time at <a href="mailto:support@opsee.co">support@opsee.com</a>.</p>
      </div>
    );
  },
  renderInner(){
    if (_.find(this.props.redux.env.bastions, 'connected')){
      return (
        <Padding tb={1}>
          <Alert color="info">
            It looks like you already have an instance in your environment.
            At this time, Opsee only supports one instance per customer.
            If you need more, please <a href="mailto:support@opsee.co">contact us</a>.
          </Alert>
        </Padding>
      );
    }
    if (this.state.isPolling) {
      return (
        <div>
          <Padding tb={1}>
            {this.renderInstructions()}
          </Padding>

          <p>Waiting for your CloudFormation role creation to complete...</p>
        </div>
      );
    }

    return (
      <div>
        <p>It&rsquo;s time to launch our CloudFormation stack. This will launch the AWS console.
        Choose a region by clicking one of the buttons below.
        When you&rsquo;re finished, come back to Opsee to continue installation.</p>

        <Padding tb={1}>
          {this.renderInstructions()}
        </Padding>

        {this.renderRegions()}
      </div>
    );
  },
  render() {
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