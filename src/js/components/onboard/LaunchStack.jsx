/* eslint-disable */
import _ from 'lodash';
import React, {PropTypes} from 'react';
import {History, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';

import Checkmark from '../svgs/Checkmark';
import {onboard as actions} from '../../actions';
import {Button} from '../forms';
import {NewWindow} from '../icons';
import {Highlight, ProgressBar, StatusHandler, Toolbar} from '../global';
import {Expandable, Padding, Col, Grid, Row} from '../layout';
import {Heading} from '../type';
import crossAccountImg from '../../../img/tut-cross-account.svg';
import templates from '../../modules/awsTemplates';
import {SetInterval} from '../../modules/mixins';
import ReviewAccess from './ReviewAccess';
import style from './onboard.css';

const LaunchStack = React.createClass({
  mixins: [History, SetInterval],
  propTypes: {
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        onboardGetTemplates: PropTypes.object
      }),
      onboard: PropTypes.shape({
        templates: PropTypes.array
      })
    }),
    actions: PropTypes.shape({
      getTemplates: PropTypes.func
    })
  },
  getInitialState(){
    return {
      hasClicked: false,
      showInstructions: false
    };
  },
  componentWillMount() {
    if (!this.getTemplateURL()) { // TODO clear this between onboarding somehow
      this.props.actions.makeLaunchRoleUrlTemplate();
    }

    const item = this.props.redux.asyncActions.onboardGetTemplates;
    if (!item.status){
      this.props.actions.getTemplates();
    }
  },
  componentDidMount(){
    this.setInterval(() => {
      this.props.actions.hasRole();
    }, 1000 * 5); // every 5 seconds
  },
  componentWillReceiveProps(){
    console.log(`Has role? ${this.props.redux.onboard.hasRole}`);
    if (this.props.redux.onboard.hasRole && this.state.hasClicked) {
      // this.history.pushState(null, '/start/review-instance');
    }
  },
  getTemplateURL() {
    const urlTemplate = _.get(this.props.redux, 'onboard.regionLaunchURL');
    return urlTemplate ? _.replace(urlTemplate, 'region=${region}', '') : null;
  },
  onOpenConsole(e) {
    this.setState({ hasClicked: true })
  },
  toggleInstructions(shouldShow) {
    this.setState({ showInstructions: shouldShow });
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
  renderLaunchButton(){
    if (this.props.redux.asyncActions.onboardMakeLaunchTemplate.state === 'pending') {
      return (
        <Button onClick={this.onOpenConsole} color="success" disabled block chevron>Loading...</Button>
      );
    }

    const verb = this.state.hasClicked ? 'Relaunch' : 'Launch';
    return (
      <div>
        <Button to={this.getTemplateURL()} target="_blank" onClick={this.onOpenConsole} color="success" block>{verb} AWS Console <NewWindow btn /></Button>
        <p className="text-center"><Link to="/start/launch-instance"><small>DEBUG: click to skip</small></Link></p>
      </div>
    );
  },
  renderLearnMore(){
    return (
      <div>
        <ReviewAccess />
        <Padding tb={1}>
          <Button onClick={this.toggleInstructions.bind(null, false)} color="primary" block>Got it</Button>
        </Padding>
      </div>
    );
  },
  renderInstructions(){
    return (
      <div>
        <Padding tb={4} className="text-center">
          <Padding tb={2}>
            <StatusHandler status="pending" />
          </Padding>
        </Padding>

        <Padding tb={2}>
          <h3 className="text-center">Waiting for cross-account role to finish...</h3>
        </Padding>

        how to install

        {this.renderButtons()}
      </div>
    );
  },
  renderDone(){
    return (
      <div>
        <Checkmark />
        <Padding tb={2}>
          <p className="text-center">Awesome! Cross-account access has been set up.</p>
        </Padding>
        <Button to="/start/launch-instance" color="success" chevron block>Continue</Button>
      </div>
    );
  },
  renderButtons(){
    return (
      <Padding tb={1}>
        <Padding b={1}>
          <Button onClick={this.toggleInstructions.bind(null, true)} color="primary" block>Learn More</Button>
        </Padding>
        <Padding b={1}>
          {this.renderLaunchButton()}
        </Padding>
      </Padding>
    );
  },
  renderInner(){
    if (this.state.showInstructions) {
      return this.renderLearnMore();
    }

    if (this.state.hasClicked) {
      if (!this.props.redux.onboard.hasRole) {
        return this.renderInstructions();
      }
      return this.renderDone();
    }

    return (
      <div>
        <Padding a={4} className="text-center">
          <img src={crossAccountImg} />
        </Padding>

        <Padding tb={2}>
          <h2>Set Up Cross-Account Access.</h2>
        </Padding>

        <p>Cross-account access is like giving a cat sitter the key to your house.
        Opsee will be able to take actions in your AWS environment on your behalf.
        We need this capability to launch an EC2 instance to healthcheck your
        services and manage that instance throughout its lifecycle.</p>

        <p>To set up cross-account access, you'll need to install Opsee's
        CloudFormation Stack in your AWS console.</p>

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
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LaunchStack);
