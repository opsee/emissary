import _ from 'lodash';
import React, {PropTypes} from 'react';
import {History, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';

import {
  onboard as actions,
  analytics as analyticsActions
} from '../../actions';
import {Button} from '../forms';
import {NewWindow} from '../icons';
import {Highlight, StatusHandler} from '../global';
import {Expandable, Padding, Col, Grid, Row} from '../layout';
import crossAccountImg from '../../../img/tut-cross-account.svg';
import Instructions from './LaunchStackInstructions';
import templates from '../../modules/awsTemplates';
import {SetInterval} from '../../modules/mixins';
import Checkmark from './Checkmark';
import style from './onboard.css';

const LaunchStack = React.createClass({
  mixins: [History, SetInterval],
  propTypes: {
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        onboardGetTemplates: PropTypes.object,
        onboardHasRole: PropTypes.object
      }),
      onboard: PropTypes.shape({
        templates: PropTypes.array,
        role: PropTypes.shape({
          region: PropTypes.string
        })
      })
    }),
    actions: PropTypes.shape({
      hasRole: PropTypes.func,
      makeLaunchRoleUrl: PropTypes.func,
      getTemplates: PropTypes.func
    }),
    analyticsActions: PropTypes.shape({
      trackEvent: PropTypes.func
    })
  },
  getInitialState(){
    return {
      hasClicked: false
    };
  },
  componentWillMount() {
    if (!this.getTemplateURL()) { // TODO clear this between onboarding somehow
      this.props.actions.makeLaunchRoleUrl();
    }
  },
  componentDidMount(){
    this.props.analyticsActions.trackEvent('Onboard', 'launch-stack');
    setTimeout(() => {
      this.props.analyticsActions.trackEvent('Onboard', 'launch-stack-stuck');
    }, 1000 * 7); // in 7 seconds let us know they've been here too long
    this.setInterval(() => {
      this.props.actions.hasRole();
    }, 1000 * 5); // every 5 seconds
  },
  getRole(){
    return _.get(this.props.redux.onboard, 'role.region');
  },
  getTemplateURL() {
    return _.get(this.props.redux, 'onboard.regionLaunchURL');
  },
  onOpenConsole() {
    this.setState({ hasClicked: true });
  },
  renderTemplate() {
    const data = this.props.redux.onboard.templates[2]; // FIXME
    if (data){
      return (
        <Padding tb={1}>
          <Expandable style={{background: seed.color.gray9}}>
            <Highlight style={{padding: '1rem'}}>
              {data.text}
            </Highlight>
          </Expandable>
          <p><small className="text-muted">Last modified: {data.headers['last-modified']}</small></p>
        </Padding>
      );
    }
    return (
      <Padding b={1}>
        <a href={_.get(templates, 'role')} target="_blank">View File</a>
      </Padding>
    );
  },
  renderInstructions(){
    return (
      <div>
        <Padding tb={2} className="text-center">
          <Padding b={3}>
            <StatusHandler status="pending" />
          </Padding>
          <div style={{opacity: 0.75}}>
            Waiting for cross-account role...
          </div>
          <div style={{opacity: 0.75}}>
            <p><small>(Make sure to come back when it's done!)</small></p>
          </div>
        </Padding>
        <Instructions />
        {this.renderButtons()}
      </div>
    );
  },
  renderDone(){
    const stackRegion = _.get(this.props.redux.onboard, 'role.region');
    return (
      <div>
        <Padding tb={4} lr={2} style={{margin: '0 auto'}}>
          <Checkmark />
        </Padding>
         <Padding b={2} className="text-center">
          <h2>Now we're role-in!</h2>
        </Padding>
        <p>Your Opsee role stack was installed in {stackRegion}. You can manage it anytime from your AWS console.</p>
        <Padding tb={2}>
          <Button to="/start/launch-instance" color="success" chevron block>Continue</Button>
        </Padding>
      </div>
    );
  },
  renderLaunchButton(){
    const isFirstPoll = this.props.redux.asyncActions.onboardHasRole.history.length < 1;
    if (isFirstPoll) {
      return (
        <Button onClick={this.onOpenConsole} color="primary" disabled block>Loading...</Button>
      );
    }
    const verb = this.state.hasClicked ? 'Relaunch' : 'Launch';
    return (
      <Button to={this.getTemplateURL()} target="_blank" onClick={this.onOpenConsole} color="primary" block>{verb} AWS Console <NewWindow btn /></Button>
    );
  },
  renderButtons(){
    return (
      <Padding tb={2}>
        <Padding b={1}>
          {this.renderLaunchButton()}
        </Padding>
        <Padding tb={1} className="text-center">
          <p><small><Link to="/start/review-stack">Learn more about the cross-account role stack</Link></small></p>
        </Padding>
      </Padding>
    );
  },
  renderInner(){
    if (this.getRole()) {
      return this.renderDone();
    }
    if (this.state.hasClicked) {
      return this.renderInstructions();
    }
    return (
      <div>
        <Padding b={2}>
          <small>STEP 1 of 3</small>
          <h2>Set Up Cross-Account Access</h2>
        </Padding>
        <Padding a={4} className="text-center">
          <img src={crossAccountImg} />
        </Padding>

        <p>Cross-account access is like giving a cat sitter the key to your house.
        Opsee will be able to take actions in your AWS environment on your behalf.
        We need this capability to launch an EC2 instance to healthcheck your
        services and manage that instance throughout its lifecycle.</p>

        <p>To set up cross-account access, you'll need to install Opsee's CloudFormation Stack in your AWS console.</p>

        {this.renderButtons()}
      </div>
    );
  },
  render() {
    return (
      <div className={style.transitionPanel}>
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
  actions: bindActionCreators(actions, dispatch),
  analyticsActions: bindActionCreators(analyticsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LaunchStack);
