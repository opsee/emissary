import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Toolbar} from '../global';
import BastionInstaller from './BastionInstaller.jsx';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {flag} from '../../modules';
import {Button} from '../forms';
import {onboard as actions} from '../../actions';
import {PagerdutyConnect, SlackConnect} from '../integrations';

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
    return this.props.actions.install();
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
      if (slack && !pagerduty){
        return (
          <Padding>
            While you&rsquo;re waiting, <SlackConnect/> to get notifications in your favorite channel.
          </Padding>
        );
      } else if (slack && pagerduty){
        return (
          <Padding>
            While you&rsquo;re waiting, <SlackConnect/> to get notifications in your favorite channel. <br/>You can also set up a connection to <PagerdutyConnect>PagerDuty</PagerdutyConnect>.
          </Padding>
        );
      }
    }
    return null;
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
          {this.renderText()}
          {this.getBastionMessages().map((b, i) => {
            return (
              <Padding b={1} key={`bastion-installer-${i}`}>
                <BastionInstaller messages={b.messages} connected={self.isComplete()}/>
              </Padding>
            );
          })}
          {this.renderBtn()}
          {this.renderSlack()}
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
       <div>
        <Toolbar title="Instance Installation"/>
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

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(Install);