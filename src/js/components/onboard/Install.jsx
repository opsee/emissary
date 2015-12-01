import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Toolbar} from '../global';
import {OnboardStore, GlobalStore} from '../../stores';
import {OnboardActions} from '../../actions';
import BastionInstaller from './BastionInstaller.jsx';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import Survey from './Survey.jsx';
import config from '../../modules/config';
import {Button} from '../forms';
import {Padding} from '../layout';
import {onboard as actions} from '../../reduxactions';

const statics = {
  checkedInstallStatus: false
};

const Install = React.createClass({
  mixins: [OnboardStore.mixin, GlobalStore.mixin],
  propTypes: {
    path: PropTypes.string,
    location: PropTypes.object,
    example: PropTypes.bool,
    actions: PropTypes.shape({
      setCredentials: PropTypes.func,
      vpcScan: PropTypes.func
    })
  },
  componentWillMount(){
    if (config.demo || this.props.example){
      return this.props.actions.onboardExampleInstall();
    }
    if(this.props.redux.onboard.installData){
     return this.props.actions.install();
    }
    return this.props.history.pushState(null, '/start/region-select');
  },
  storeDidChange(){
    let msgs = _.chain(GlobalStore.getSocketMessages()).filter({command: 'launch-bastion'}).filter(m => {
      return m.attributes && m.attributes.ResourceType;
    }).value();

    let reject = {instance_id: '5tRx0JWEOQgGVdLoKj1W3Z'};
    if (config.env !== 'production'){
      if (this.props.location.query.fail){
        reject = {instance_id: '1r6k6YRB3Uzh0Bk5vmZsFU'};
      }
    }
    const installStatus = OnboardStore.getOnboardInstallStatus();
    if (installStatus && typeof installStatus === 'object'){
      if (this.state.launchAttempts < 3){
        this.setState({launchAttempts: this.state.launchAttempts + 1});
        setTimeout(() => {
          OnboardActions.onboardInstall(OnboardStore.getFinalInstallData());
        }, 3000);
      }else if (!this.state.showError){
        this.setState({showError: true});
      }
    }
    const bastions = _.chain(msgs)
    .reject(reject)
    .groupBy('instance_id').map((value, key) => {
      return {
        id: key,
        messages: _.chain(value).pluck('attributes').sort((a, b) => {
          return Date.parse(a.Timestamp) - Date.parse(b.Timestamp);
        }).value()
      };
    }).value();
    if (OnboardStore.getGetBastionsStatus() === 'success'){
      if (!OnboardStore.getBastions().length){
        setTimeout(OnboardActions.getBastions, 12000);
      }
    }
    if (OnboardStore.getGetCustomerStatus() === 'success'){
      if (!OnboardStore.getCustomer().id){
        setTimeout(OnboardActions.getCustomer, 12000);
      }
    }
    this.setState({bastions});
  },
  componentDidUpdate(){
    // const data = OnboardStore.getFinalInstallData();
    // if (data && !started){
    //   const dataHasValues = _.chain(data).values().every(_.identity).value();
    //   if (dataHasValues && data.regions.length){
    //     OnboardActions.onboardInstall(data);
    //   }
    // }else if (!data && !started){
    //   this.history.replaceState(null, '/start/region-select');
    // }
    // this.props.history.replaceState(null, '/start/region-select');
    if (this.areBastionsComplete() && !this.state.startedPolling){
      OnboardActions.getBastions();
      OnboardActions.getCustomer();
      /* eslint-disable react/no-did-update-set-state*/
      this.setState({startedPolling: true});
    }
  },
  isBastionLaunching(){
    return !!(this.props.redux.app.socketMessages.filter({command: 'launch-bastion'}).length);
  },
  getInitialState() {
    return {
      bastions: [],
      startedPolling: false,
      launchAttempts: 0,
      showError: false
    };
  },
  getBastionStatuses(){
    return _.chain(this.state.bastions).pluck('messages').map(bastionMsgs => {
      return _.chain(bastionMsgs).filter({ResourceType: 'AWS::CloudFormation::Stack'}).filter(msg => {
        return msg.ResourceStatus === 'CREATE_COMPLETE' || msg.ResourceStatus === 'ROLLBACK_COMPLETE';
      }).pluck('ResourceStatus').first().value();
    }).value();
  },
  getBastionErrors(){
    return _.filter(this.getBastionStatuses(), stat => stat === 'ROLLBACK_COMPLETE');
  },
  getBastionSuccesses(){
    return _.filter(this.getBastionStatuses(), stat => stat === 'CREATE_COMPLETE');
  },
  areBastionsComplete(){
    const stats = this.getBastionStatuses();
    return _.every(stats) && stats.length;
  },
  areBastionsConnected(){
    return OnboardStore.getBastions().length && !this.getBastionErrors().length;
  },
  renderSurvey(){
    if (!config.demo){
      return (
        <Padding t={3}>
          <hr/>
          <h2>Opsee Customer Survey</h2>
          <Survey/>
        </Padding>
      );
    }
    return <div/>;
  },
  renderBtn(){
    if (this.areBastionsComplete()){
      if (this.getBastionErrors().length){
        return (
          <Alert bsStyle="danger">
            We are aware of your failed Bastion install and we will contact you via email as soon as possible. Thank you!
          </Alert>
        );
      }else if (!this.areBastionsConnected()){
        return (
          <Padding tb={3}>
            <p>Your bastion has been installed, waiting for successful connection...</p>
          </Padding>
        );
      }
      return (
        <Padding tb={3}>
          <p>All clear!</p>
          <Button to="/check-create" color="primary" block chevron>
            Create a Check
          </Button>
        </Padding>
      );
    }
    return <div/>;
  },
  renderText(){
    if (this.props.redux.onboard.bastionLaunching === undefined && !this.props.redux.env.bastions.length){
      return (
        <p>Checking installation status...</p>
      );
    }else if (!this.areBastionsComplete().length && !this.getBastionErrors().length){
      return (
        <p>We are now installing the bastion in your selected VPC. This could take a few minutes.</p>
      );
    }
    return <div/>;
    // if (this.areBastionsComplete()){
    //   const bastionErrors = this.getBastionErrors();
    //   const bastionSuccesses = this.getBastionSuccesses();
    //   if (bastionErrors.length && !bastionSuccesses.length){
    //     return (
    //       <p>{bastionErrors.length > 1 ? bastionErrors.length : ''} Bastion{bastionErrors.length > 1 ? 's' : ''} failed to install correctly</p>
    //     );
    //   }else if (bastionErrors.length){
    //     return (
    //       <p>{bastionErrors.length} Bastions failed to install correctly, while {bastionSuccesses.length} completed successfully.</p>
    //     );
    //   }
    //   return <div/>;
    // }
  },
  renderInner(){
    if (!this.state.showError){
      return (
        <div>
          {this.renderText()}
          {this.state.bastions.map((b, i) => {
            return (
              <Padding b={1} key={`bastion-installer-${i}`}>
                <BastionInstaller {...b}/>
              </Padding>
            );
          })}
          {this.renderBtn()}
          {this.renderSurvey()}
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