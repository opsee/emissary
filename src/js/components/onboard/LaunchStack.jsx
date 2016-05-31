import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';
import {Link} from 'react-router';

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
  mixins: [SetInterval],
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
        }),
        regionLaunchURL: PropTypes.string
      }),
      user: PropTypes.object
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
        <Button onClick={this.onOpenConsole} color="primary" disabled block>Looking for Opsee stack...</Button>
      );
    }
    const verb = this.state.hasClicked ? 'Relaunch' : 'Launch';
    return (
      <Button to={this.getTemplateURL()} target="_blank" onClick={this.onOpenConsole} color="primary" block>{verb} AWS Console <NewWindow btn /></Button>
    );
  },
  renderCLI(){
    if (!_.has(this.props.redux.onboard, 'regionLaunchURL')) {
      return this.renderLoading();
    }
    const {regionLaunchURL} = this.props.redux.onboard;
    const customerID = this.props.redux.user.get('customer_id');
    return (
      <div>
        <p>To install the role stack using the command line, make sure you have <a target="_blank" href="https://aws.amazon.com/cli/">the AWS CLI</a> set-up, then run this command to add the role stack:</p>
        {!!regionLaunchURL ?
          <Highlight>
            <Padding a={1}>
              aws cloudformation create-stack --stack-name opsee-role-{customerID} --template-url {regionLaunchURL} --capabilities CAPABILITY_IAM
            </Padding>
          </Highlight>
          :
          <Padding tb={1} className="text-center">
            <p className={style.subtext}>generating template URL...</p>
          </Padding>
        }
      </div>
    );
  },
  renderButtons(){
    return (
      <Padding tb={2}>
        <Padding b={1}>
          {this.renderLaunchButton()}
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
          <h2>Add our IAM Role</h2>
        </Padding>
        <Padding a={4} className="text-center">
          <img src={crossAccountImg} />
        </Padding>

        <p>Setting up cross-account access will allow Opsee to take <em>some</em> specific actions in your AWS environment on your behalf:</p>
        <ul>
          <li>Launching our EC2 instance and managing it throughout its lifecycle (eg software updates and reboots)</li>
          <li>Health checking your services</li>
          <li>Querying AWS APIs for information about your environment</li>
        </ul>

        <p>To set up cross-account access, you'll install our CloudFormation Stack. This is done one of two ways: by launching it in your AWS console, or from your terminal using <a target="_blank" href="https://aws.amazon.com/cli/">the AWS CLI</a>.</p>
        <p>Both ways are safe, secure, and certified by Amazon. You can manage or remove the role at any time in your AWS console.</p>

        {this.renderButtons()}

        <Padding tb={1}>
          {this.renderCLI()}
        </Padding>

        <Padding tb={1} className="text-center">
          <p><small><Link to="/start/review-stack">Learn more about our IAM Role</Link></small></p>
        </Padding>
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
