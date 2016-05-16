/* eslint-disable */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {plain as seed} from 'seedling';

import Checkmark from '../svgs/Checkmark';
import {Toolbar} from '../global';
import BastionInstaller from './BastionInstaller.jsx';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {flag} from '../../modules';
import {Button} from '../forms';
import {onboard as actions} from '../../actions';
import {PagerdutyConnect, SlackConnect} from '../integrations';
import style from './onboard.css';

const Install = React.createClass({
  propTypes: {
    path: PropTypes.string,
    location: PropTypes.object,
    example: PropTypes.bool,
    actions: PropTypes.shape({
      setCredentials: PropTypes.func,
      onboardExampleInstall: PropTypes.func,
      install: PropTypes.func.isRequired,
      exampleInstall: PropTypes.func
    }),
    redux: PropTypes.shape({
      app: PropTypes.shape({
        socketMessages: PropTypes.array
      }),
      env: PropTypes.shape({
        bastions: PropTypes.array
      }),
      user: PropTypes.object,
      asyncActions: PropTypes.object
    }).isRequired
  },
  componentWillMount(){
    if (this.props.location.pathname.match('install-example')){
      return this.props.actions.exampleInstall();
    }
    // return this.props.actions.install();
  },
  getBastionMessages(){
    let msgs = _.chain(this.props.redux.app.socketMessages).filter({command: 'launch-bastion'}).filter(m => {
      return m.attributes && m.attributes.ResourceType;
    }).value();

    let reject = {instance_id: '5tRx0JWEOQgGVdLoKj1W3Z'};
    if (process.env.NODE_ENV !== 'production'){
      if (this.props.location.query.fail){
        reject = {instance_id: '1r6k6YRB3Uzh0Bk5vmZsFU'};
      }
    }
    return _.chain(msgs)
    .reject(reject)
    .groupBy('instance_id').map((value, key) => {
      return {
        id: key,
        messages: _.chain(value).map('attributes').sort((a, b) => {
          if (typeof a.Timestamp === 'string'){
            return Date.parse(a.Timestamp) - Date.parse(b.Timestamp);
          }
          return a.Timestamp - b.Timestamp;
        }).value()
      };
    }).value();
  },
  getBastionStatuses(){
    return _.chain(this.getBastionMessages()).map('messages').map(bastionMsgs => {
      return _.chain(bastionMsgs).filter({ResourceType: 'AWS::CloudFormation::Stack'}).filter(msg => {
        return msg.ResourceStatus === 'CREATE_COMPLETE' || msg.ResourceStatus === 'ROLLBACK_COMPLETE';
      }).map('ResourceStatus').head().value();
    }).value();
  },
  getBastionErrors(){
    const one = _.chain(this.props.redux.app.socketMessages)
    .filter({command: 'launch-bastion'})
    .filter({state: 'failed'})
    .value();
    return _.filter(this.getBastionStatuses(), stat => stat === 'ROLLBACK_COMPLETE').concat(one);
  },
  getBastionSuccesses(){
    return _.filter(this.getBastionStatuses(), stat => stat === 'CREATE_COMPLETE');
  },
  getDiscoveryStatus(){
    return _.chain(this.props.redux.app.socketMessages).filter({command: 'discovery'}).last().get('state').value();
  },
  getBastionConnectionStatus(){
    return _.chain(this.props.redux.app.socketMessages).filter({command: 'connect-bastion'}).last().get('state').value();
  },
  isInstallError(){
    const status = this.props.redux.asyncActions.onboardInstall.status;
    return status && typeof status !== 'string';
  },
  isBastionLaunching(){
    return !!(_.filter(this.props.redux.app.socketMessages, {command: 'launch-bastion'}).length);
  },
  isBastionConnecting(){
    const {socketMessages} = this.props.redux.app;
    return !!(_.chain(socketMessages).filter({command: 'connect-bastion'}).last().get('state').value() === 'in-progress');
  },
  isDiscoveryComplete(){
    if (this.props.location.pathname.match('install-example')){
      return true;
    }
    return this.getDiscoveryStatus() === 'complete';
  },
  isBastionConnected(){
    return this.getBastionConnectionStatus() === 'complete';
  },
  isComplete(){
    //the bastion connection can be determined an alternate way that indicates discovery is fully complete:
    const bool1 = _.chain(this.props.redux.app.socketMessages)
    .filter({command: 'bastions'})
    .find(msg => {
      return _.chain(msg).get('attributes.bastions').find('connected').value();
    })
    .value();
    const bool2 = this.isBastionConnected() && this.isDiscoveryComplete();
    return !!(bool1 || bool2);
  },
  areBastionsComplete(){
    const stats = this.getBastionStatuses();
    const {socketMessages} = this.props.redux.app;
    return (_.every(stats) && stats.length) ||
    _.filter(socketMessages, {command: 'connect-bastion', state: 'complete'}).length;
  },
  renderBtn(){
    if (this.isComplete()){
      return (
        <Padding tb={3}>
          <Button to="/check-create" color="primary" block chevron>
            Create a Check
          </Button>
        </Padding>
      );
    }
    if (this.getBastionErrors().length){
      return (
        <Alert color="danger">
          We are aware of your failed instance install and we will contact you via email as soon as possible. Thank you!
        </Alert>
      );
    }
    return null;
  },
  renderText(){
    if (this.isBastionLaunching() && !this.isComplete()){
      return (
        <Padding b={1}>
          <p>We are now installing our instance in your selected VPC. This takes at least 5 minutes, increasing with the size of your environment. You don't need to stay on this page, and we'll email you when installation is complete.</p>
        </Padding>
      );
    } else if (this.isComplete()){
      return (
        <p>You are all set. Create a check to get started.</p>
      );
    } else if (this.isBastionConnecting()){
      return (
        <p>Your instance is currently attempting to connect. Hang on...</p>
      );
    }
    return <p>Checking installation status...</p>;
  },
  renderSlack(){
    const slack = !!flag('integrations-slack');
    const pagerduty = !!flag('integrations-pagerduty');
    if (!this.isComplete()){
      return (
        <Padding tb={2}>
          <p>While you're waiting, you can set up notification channels for alerts.</p>
          <Padding b={1}>
            <Button color="primary" block>Connect to Slack</Button>
          </Padding>
          <Button color="primary" block>Connect to PagerDuty</Button>
        </Padding>
      );
    }
    return null;
  },
  renderSuccess(){
    if (this.isComplete()) {
      return (
        <div>
          <Padding b={4} className="text-center">
            <Checkmark />
            <h2>You're all done!</h2>
            <p>The Opsee instance was successfully installed. Here's what Opsee found...</p>
          </Padding>

          <Grid fluid>
            <Row>
              <Col xs={4}>
                <div className="text-center">
                  <h3>120</h3>
                  <div style={{opacity: 0.5}}><small>EC2 instances</small></div>
                </div>
              </Col>
              <Col xs={4}>
                <div className="text-center">
                  <h3>89</h3>
                  <div style={{opacity: 0.5}}><small>security groups</small></div>
                </div>
              </Col>
              <Col xs={4}>
                <div className="text-center">
                  <h3>10</h3>
                  <div style={{opacity: 0.5}}><small>load balancers</small></div>
                </div>
              </Col>
            </Row>
          </Grid>

          <Padding tb={4} className="text-center">
            <h2>420</h2>
            <h3>health checks</h3>
            <p>were generated for you! Nice.</p>
          </Padding>
          <div>
            <Button to="/" color="success" block chevron>View checks</Button>
          </div>
        </div>
      );
    }
  },
  renderInner(){
    const self = this;
    if (this.getBastionConnectionStatus() === 'failed'){
      return (
        <Alert color="danger">
          Our instance failed to connect. Please contact support by visiting our <Link to="/help" style={{color: 'white', textDecoration: 'underline'}}>help page</Link>
        </Alert>
      );
    } else if (this.isComplete()) {
      return this.renderSuccess();
    } else if (!this.isInstallError()){
      return (
        <div>
          {this.getBastionMessages().map((b, i) => {
            return (
              <Padding b={1} key={`bastion-installer-${i}`}>
                <BastionInstaller messages={b.messages} connected={self.isComplete()}/>
              </Padding>
            );
          })}
          {this.renderText()}
          {this.renderSlack()}
          {this.renderBtn()}
        </div>
      );
    }
    return (
      <Alert color="danger">
        Something went wrong before the install began. Please contact support by visiting our <Link to="/help" style={{color: 'white', textDecoration: 'underline'}}>help page</Link>
      </Alert>
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

export default connect(mapStateToProps, mapDispatchToProps)(Install);