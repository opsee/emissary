import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import {OnboardStore, GlobalStore} from '../../stores';
import {OnboardActions} from '../../actions';
import _ from 'lodash';
import router from '../../modules/router';
import BastionInstaller from './BastionInstaller.jsx';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';
import Survey from './Survey.jsx';
import config from '../../modules/config';
import {Button} from '../forms';
import {Padding} from '../layout';

const statics = {
  checkedInstallStatus: false
};

const Install = React.createClass({
  mixins: [OnboardStore.mixin, GlobalStore.mixin],
  propTypes: {
    path: PropTypes.string,
    query: PropTypes.object
  },
  componentWillMount(){
    if (config.demo || this.props.path.match('example')){
      OnboardActions.onboardExampleInstall().then(() => {
        statics.checkedInstallStatus = true;
      });
    }else {
      OnboardStore.getBastionHasLaunchedPromise().then((started) => {
        statics.checkedInstallStatus = true;
        const data = OnboardStore.getFinalInstallData();
        if (data && !started){
          const dataHasValues = _.chain(data).values().every(_.identity).value();
          if (dataHasValues && data.regions.length){
            OnboardActions.onboardInstall(data);
          }
        }else if (!data && !started){
          router.transitionTo('onboardRegionSelect');
        }
      });
    }
  },
  storeDidChange(){
    let msgs = _.chain(GlobalStore.getSocketMessages()).filter({command: 'launch-bastion'}).filter(m => {
      return m.attributes && m.attributes.ResourceType;
    }).value();

    let reject = {instance_id: '5tRx0JWEOQgGVdLoKj1W3Z'};
    if (config.env !== 'production'){
      if (this.props.query.fail){
        reject = {instance_id: '1r6k6YRB3Uzh0Bk5vmZsFU'};
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
    if (this.areBastionsInstalled() && !this.state.startedPolling){
      OnboardActions.getBastions();
      OnboardActions.getCustomer();
      /* eslint-disable react/no-did-update-set-state*/
      this.setState({startedPolling: true});
    }
  },
  getInitialState() {
    return {
      bastions: [],
      startedPolling: false
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
  isBastionsComplete(){
    const stats = this.getBastionStatuses();
    return _.every(stats) && stats.length;
  },
  areBastionsInstalled(){
    const stats = this.getBastionStatuses();
    return _.every(stats) && stats.length;
  },
  areBastionsConnected(){
    return OnboardStore.getBastions().length;
  },
  renderSurvey(){
    if (!config.demo){
      return (
        <Padding tb={1}>
          <Survey/>
        </Padding>
      );
    }
    return <div/>;
  },
  renderBtn(){
    const bastionErrors = this.getBastionErrors();
    if (this.areBastionsInstalled()){
      if (!this.areBastionsConnected()){
        return (
          <Padding tb={3}>
            <p>Your bastion has been installed, waiting for successful connection...</p>
          </Padding>
        );
      }else if (!bastionErrors.length){
        return (
          <Padding tb={3}>
            <p>All clear!</p>
            <Button to="checkCreate" color="primary" block chevron>
              Create a Check
            </Button>
          </Padding>
        );
      }
      return (
        <Alert type="info">
          We are aware of your failed Bastion install and we will contact you via email as soon as possible. Thank you!
        </Alert>
      );
    }
    return <div/>;
  },
  renderText(){
    if (!statics.checkedInstallStatus && !this.state.bastions.length){
      return (
        <p>Checking installation status...</p>
      );
    }
    if (this.areBastionsInstalled()){
      const bastionErrors = this.getBastionErrors();
      const bastionSuccesses = this.getBastionSuccesses();
      if (bastionErrors.length && !bastionSuccesses.length){
        return (
          <p>{bastionErrors.length > 1 ? bastionErrors.length : ''} Bastion{bastionErrors.length > 1 ? 's' : ''} failed to install correctly</p>
        );
      }else if (bastionErrors.length){
        return (
          <p>{bastionErrors.length} Bastions failed to install correctly, while {bastionSuccesses.length} completed successfully.</p>
        );
      }
      return <div/>;
    }
    return (
      <p>We are now installing the bastion in your selected VPC. This could take a few minutes.</p>
    );
  },
  render() {
    return (
       <div>
        <Toolbar title="Bastion Installation"/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderText()}
              {this.state.bastions.map(b => {
                return (
                  <Padding tb={1}>
                    <BastionInstaller {...b}/>
                  </Padding>
                );
              })}
              {this.renderBtn()}
              {this.renderSurvey()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Install;