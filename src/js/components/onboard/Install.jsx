import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Toolbar} from '../global';
import BastionInstaller from './BastionInstaller.jsx';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import Survey from './Survey.jsx';
import config from '../../modules/config';
import {Button} from '../forms';
import {Padding} from '../layout';
import {onboard as actions} from '../../actions';

const Install = React.createClass({
  propTypes: {
    path: PropTypes.string,
    location: PropTypes.object,
    example: PropTypes.bool,
    actions: PropTypes.shape({
      setCredentials: PropTypes.func,
      vpcScan: PropTypes.func,
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
    if (config.env !== 'production'){
      if (this.props.location.query.fail){
        reject = {instance_id: '1r6k6YRB3Uzh0Bk5vmZsFU'};
      }
    }
    return _.chain(msgs)
    .reject(reject)
    .groupBy('instance_id').map((value, key) => {
      return {
        id: key,
        messages: _.chain(value).pluck('attributes').sort((a, b) => {
          return Date.parse(a.Timestamp) - Date.parse(b.Timestamp);
        }).value()
      };
    }).value();
  },
  getBastionStatuses(){
    return _.chain(this.getBastionMessages()).pluck('messages').map(bastionMsgs => {
      return _.chain(bastionMsgs).filter({ResourceType: 'AWS::CloudFormation::Stack'}).filter(msg => {
        return msg.ResourceStatus === 'CREATE_COMPLETE' || msg.ResourceStatus === 'ROLLBACK_COMPLETE';
      }).pluck('ResourceStatus').first().value();
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
    return this.isBastionConnected() && this.isDiscoveryComplete();
  },
  areBastionsComplete(){
    const stats = this.getBastionStatuses();
    return (_.every(stats) && stats.length) ||  _.filter(this.props.redux.app.socketMessages, {command: 'connect-bastion'}).length;
  },
  renderBtn(){
    if (this.areBastionsComplete()){
      if (this.isComplete()){
        return (
          <Padding tb={3}>
            <Button to="/check-create" color="primary" block chevron>
              Create a Check
            </Button>
          </Padding>
        );
      }
    }
    if (this.getBastionErrors().length){
      return (
        <Alert bsStyle="danger">
          We are aware of your failed Bastion install and we will contact you via email as soon as possible. Thank you!
        </Alert>
      );
    }
    return <div/>;
  },
  renderText(){
    if (this.isBastionLaunching() && !this.areBastionsComplete() && !this.getBastionErrors().length){
      return (
        <Padding b={1}>
          <p>We are now installing the bastion in your selected VPC. This takes at least 5 minutes, increasing with the size of your environment. You don't need to stay on this page, and we'll email you when installation is complete.</p>
        </Padding>
      );
    }else if (this.areBastionsComplete()){
      return <div/>;
    }
    return <p>Checking installation status...</p>;
  },
  renderInner(){
    if (this.getBastionConnectionStatus() === 'failed'){
      return (
        <Alert bsStyle="danger">
          The bastion failed to connect. Please contact support by visiting our <Link to="/help" style={{color: 'white', textDecoration: 'underline'}}>help page</Link>
        </Alert>
      );
    }else if (!this.isInstallError()){
      return (
        <div>
          {this.renderText()}
          {this.getBastionMessages().map((b, i) => {
            return (
              <Padding b={1} key={`bastion-installer-${i}`}>
                <BastionInstaller {...b} connected={this.isBastionConnected()}/>
              </Padding>
            );
          })}
          {this.renderBtn()}
          <Survey/>
        </div>
      );
    }
    return (
      <Alert bsStyle="danger">
        Something went wrong before the install began. Please contact support by visiting our <Link to="/help" style={{color: 'white', textDecoration: 'underline'}}>help page</Link>
      </Alert>
    );
  },
  render() {
    return (
       <div>
        <Toolbar title="Bastion Installation"/>
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