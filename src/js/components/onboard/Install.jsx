import _ from 'lodash';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import cx from 'classnames';

import BastionInstaller from './BastionInstaller.jsx';
import {Alert, Padding} from '../layout';
import {Button} from '../forms';
import {onboard as actions} from '../../actions';
import {StatusHandler} from '../global';
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
      exampleInstall: PropTypes.func,
      getDefaultNotifications: PropTypes.func
    }),
    redux: PropTypes.shape({
      app: PropTypes.shape({
        socketMessages: PropTypes.array,
        scheme: PropTypes.string
      }),
      env: PropTypes.shape({
        bastions: PropTypes.array
      }),
      onboard: PropTypes.shape({
        defaultNotifs: PropTypes.array,
        skippedDefaultNotifs: PropTypes.bool
      }),
      user: PropTypes.object,
      asyncActions: PropTypes.object
    }).isRequired
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  componentWillMount(){
    this.props.actions.getDefaultNotifications();
    if (this.props.location.pathname.match('install-example')){
      this.props.actions.exampleInstall();
    } else {
      this.props.actions.install();
    }
  },
  componentWillReceiveProps(nextProps){
    // Only redirect if they've already completed (or skipped) notification set-up;
    // otherwise, keep the prompt for the notifs step on screen.
    if (this.isComplete(nextProps)) {
      setTimeout(() => {
        this.context.router.push('/start/postinstall');
      }, 250);
    }
  },
  getBastionMessages(props = this.props){
    let msgs = _.chain(props.redux.app.socketMessages).filter({command: 'launch-bastion'}).filter(m => {
      return m.attributes && m.attributes.ResourceType;
    }).value();

    let reject = {instance_id: '5tRx0JWEOQgGVdLoKj1W3Z'};
    if (process.env.NODE_ENV !== 'production'){
      if (props.location.query.fail){
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
  getBastionStatuses(props = this.props){
    return _.chain(this.getBastionMessages(props)).map('messages').map(bastionMsgs => {
      return _.chain(bastionMsgs).filter({ResourceType: 'AWS::CloudFormation::Stack'}).filter(msg => {
        return msg.ResourceStatus === 'CREATE_COMPLETE' || msg.ResourceStatus === 'ROLLBACK_COMPLETE';
      }).map('ResourceStatus').head().value();
    }).value();
  },
  getBastionErrors(props = this.props){
    const one = _.chain(props.redux.app.socketMessages)
    .filter({command: 'launch-bastion'})
    .filter({state: 'failed'})
    .value();
    return _.filter(this.getBastionStatuses(), stat => stat === 'ROLLBACK_COMPLETE').concat(one);
  },
  getBastionSuccesses(props = this.props){
    return _.filter(this.getBastionStatuses(props), stat => stat === 'CREATE_COMPLETE');
  },
  getDiscoveryStatus(props = this.props){
    return _.chain(props.redux.app.socketMessages).filter({command: 'discovery'}).last().get('state').value();
  },
  getBastionConnectionStatus(props = this.props){
    return _.chain(props.redux.app.socketMessages).filter({command: 'connect-bastion'}).last().get('state').value();
  },
  getNotifications(props = this.props){
    return props.redux.onboard.defaultNotifs;
  },
  isDoneNotifications(props = this.props){
    return _.size(this.getNotifications(props)) || this.props.redux.onboard.skippedDefaultNotifs;
  },
  isInstallError(props = this.props){
    const status = props.redux.asyncActions.onboardInstall.status;
    return status && typeof status !== 'string';
  },
  isBastionLaunching(props = this.props){
    return !!(_.filter(props.redux.app.socketMessages, {command: 'launch-bastion'}).length);
  },
  isBastionConnecting(props = this.props){
    const {socketMessages} = props.redux.app;
    return !!(_.chain(socketMessages).filter({command: 'connect-bastion'}).last().get('state').value() === 'in-progress');
  },
  isDiscoveryComplete(props = this.props){
    if (props.location.pathname.match('install-example')){
      return true;
    }
    return this.getDiscoveryStatus(props) === 'complete';
  },
  isBastionConnected(props = this.props){
    return this.getBastionConnectionStatus(props) === 'complete';
  },
  isComplete(props = this.props){
    //the bastion connection can be determined an alternate way that indicates discovery is fully complete:
    const bool1 = _.chain(props.redux.app.socketMessages)
    .filter({command: 'bastions'})
    .find(msg => {
      return _.chain(msg).get('attributes.bastions').find('connected').value();
    })
    .value();
    const bool2 = this.isBastionConnected(props) && this.isDiscoveryComplete(props);
    return !!(bool1 || bool2);
  },
  areBastionsComplete(props = this.props){
    const stats = this.getBastionStatuses(props);
    const {socketMessages} = props.redux.app;
    return (_.every(stats) && stats.length) ||
    _.filter(socketMessages, {command: 'connect-bastion', state: 'complete'}).length;
  },
  renderError(props = this.props){
    if (this.getBastionErrors(props).length){
      return (
        <Alert color="danger">
          We are aware of your failed instance install and we will contact you via email as soon as possible. Thank you!
        </Alert>
      );
    }
    return null;
  },
  renderStatusText(){
    if (this.isComplete()) {
      return (
        <Padding b={1}>
          Awesome! Your Opsee Instance is up and running.
        </Padding>
      );
    } else if (this.isBastionLaunching()){
      return (
        <Padding b={1}>
          <p>We are now installing our instance in your selected VPC. This takes at least 5 minutes, increasing with the size of your environment. You don't need to stay on this page, and we'll email you when installation is complete.</p>
        </Padding>
      );
    } else if (this.isBastionConnecting()){
      return (
        <p>Your instance is currently attempting to connect. Hang on...</p>
      );
    }
    return (
      <Padding tb={2} className="text-center">
        <Padding b={2}>
          <StatusHandler status="pending" />
        </Padding>
        <p className={style.subtext}>Detecting installation status...</p>
        <p className={style.subtext}>(This can take a minute or two on slow connections.)</p>
      </Padding>
    );
  },
  renderNotifPrompt(){
    const { status } = this.props.redux.asyncActions.onboardGetDefaultNotifs;
    if (status !== 'success' || this.isDoneNotifications()) {
      return null;
    }
    return (
      <Padding tb={2}>
        <p>The last thing we need to do is to set up your notification preferences, so we know where to send alerts. The Opsee EC2 instance will continue its installation in the background.</p>
        <Padding t={1}>
          <Button to="/start/notifications" color="primary" block chevron>Set up notifications</Button>
        </Padding>
      </Padding>
    );
  },
  renderInner(){
    const self = this;
    if (this.getBastionConnectionStatus() === 'failed'){
      return (
        <Alert color="danger">
          Our instance failed to connect. Please contact support by visiting our <Link to="/help" style={{color: 'white', textDecoration: 'underline'}}>help page</Link>
        </Alert>
      );
    } else if (!this.isInstallError()){
      return (
        <div>
          {this.getBastionMessages().map((b, i) => {
            return (
              <Padding tb={2} key={`bastion-installer-${i}`}>
                <BastionInstaller messages={b.messages} connected={self.isComplete()}/>
              </Padding>
            );
          })}
          {this.renderStatusText()}
          {this.renderError()}
          {this.renderNotifPrompt()}
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
      <div className={cx(style.transitionPanel, style[this.props.redux.app.scheme])}>
        <Padding tb={2}>
          <div className={style.headerStep}>STEP 2 of 3</div>
          <h2>Installing the Opsee EC2 instance...</h2>
        </Padding>
        {this.renderInner()}
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