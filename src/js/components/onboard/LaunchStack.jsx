import _ from 'lodash';
import React, {PropTypes} from 'react';
import {History} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {plain as seed} from 'seedling';

import {onboard as actions} from '../../actions';
import {Button} from '../forms';
import {Highlight, ProgressBar, Toolbar} from '../global';
import {Expandable, Padding, Col, Grid, Row} from '../layout';
import {Heading} from '../type';
import crossAccountImg from '../../../img/tut-cross-account.svg';
import templates from '../../modules/awsTemplates';
import {SetInterval} from '../../modules/mixins';
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

    console.log(`This would open ${this.getTemplateURL()} in non-debug mode.`);
    const verb = this.state.hasClicked ? 'Relaunch' : 'Launch';
    return (
      <Button to='/start/review-instance' onClick={this.onOpenConsole} color="success" block chevron>{verb} AWS Console</Button>
    );
  },
  renderInner(){
    if (this.state.showInstructions) {
      return (
        <div>
          <p>Here's some cool information on how to install.</p>
          <Padding tb={1}>
            <Button onClick={this.toggleInstructions.bind(null, false)} block>Got it</Button>
          </Padding>
        </div>
      );
    }

    if (!this.props.redux.onboard.hasRole) {
      return (
        <div>
          <h2>{this.state.clicked ? 'Waiting...' : 'Install the CloudFormation template through your AWS console.'}</h2>
          <p>When your Opsee role has been created, return here to finish installation. You'll automatically be redirected to the next step.</p>

          <Padding tb={1}>
            <Button onClick={this.toggleInstructions.bind(null, true)} block>How to Install</Button>
          </Padding>
          <Padding tb={1}>
            {this.renderLaunchButton()}
          </Padding>
        </div>
      );
    }

    return (
      <div>
        <p>Cool you're done</p>
        <Padding tb={1}>
          <Button to="/start/review-instance" color="success" block chevron>Cool</Button>
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
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LaunchStack);
