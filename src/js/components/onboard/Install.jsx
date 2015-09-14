import React, {PropTypes} from 'react';
import {Alert, Toolbar} from '../global';
import {OnboardStore, GlobalStore} from '../../stores';
import {OnboardActions} from '../../actions';
import {UserStore} from '../../stores';
import {Link} from 'react-router';
import forms from 'newforms';
import _ from 'lodash';
import router from '../../modules/router.js';
import {Close, ChevronRight} from '../icons';
import BastionInstaller from './BastionInstaller.jsx';
import {Grid, Row, Col} from '../../modules/bootstrap';
import Survey from './Survey.jsx';

const statics = {
  checkedInstallStatus:false
}

const Install = React.createClass({
  mixins: [OnboardStore.mixin, GlobalStore.mixin],
  storeDidChange(){
    let msgs = _.chain(GlobalStore.getSocketMessages()).filter({command:'launch-bastion'}).filter(m => {
        return m.attributes && m.attributes.ResourceType;
      }).value();

    let reject = false;
    if(this.props.query.fail){
      reject = {instance_id:'1r6k6YRB3Uzh0Bk5vmZsFU'}
    }else if(this.props.query.success){
      reject = {instance_id:'5tRx0JWEOQgGVdLoKj1W3Z'}
    }

    const bastions = _.chain(msgs)
    .reject(reject)
    .groupBy('instance_id').map((value, key) => {
      return {
        id:key,
        messages:_.chain(value).pluck('attributes').sort(function(a,b){
          return Date.parse(a.Timestamp) - Date.parse(b.Timestamp)
        }).value()
      }
    }).value();
    this.setState({bastions});
  },
  statics:{
    willTransitionTo(transition, params, query){
      if(!transition.path.match('example')){
        // const data = OnboardStore.getInstallData();
        // const dataHasValues = _.chain(data).values().every(_.identity).value();
        // if(!dataHasValues || !data.regions.length){
        //   transition.redirect('onboardRegionSelect');
        // }
      }
    }
  },
  getInitialState() {
    return {
      bastions:[]
    }
  },
  componentWillMount(){
    if(this.props.path.match('example')){
      OnboardActions.onboardExampleInstall();
    }else{
      OnboardStore.getBastionHasLaunchedPromise().then(function(started){
        statics.checkedInstallStatus = true;
        const data = OnboardStore.getFinalInstallData();
        if(data && !started){
          const dataHasValues = _.chain(data).values().every(_.identity).value();
          if(dataHasValues && data.regions.length){
            OnboardActions.onboardInstall(data);
          }
        }else if(!data && !started){
          router.transitionTo('onboardRegionSelect');
        }
      })
    }
  },
  bastionStatuses(){
    return _.chain(this.state.bastions).pluck('messages').map(bastionMsgs => {
      return _.chain(bastionMsgs).filter({ResourceType:'AWS::CloudFormation::Stack'}).filter(msg => {
        return msg.ResourceStatus == 'CREATE_COMPLETE' || msg.ResourceStatus == 'ROLLBACK_COMPLETE'
      }).pluck('ResourceStatus').first().value()
     }).value();
  },
  bastionsComplete(){
    const stats = this.bastionStatuses();
    return _.every(stats) && stats.length;
  },
  getBastionErrors(){
    return _.filter(this.bastionStatuses(), stat => stat == 'ROLLBACK_COMPLETE');
  },
  getBastionSuccesses(){
    return _.filter(this.bastionStatuses(), stat => stat == 'CREATE_COMPLETE');
  },
  renderSurvey(){
    return (
      <div className="padding-tb">
        <Survey/>
      </div>
    )
  },
  renderBtn(){
    const bastionErrors = this.getBastionErrors();
    const bastionSuccesses = this.getBastionSuccesses();
    if(this.bastionsComplete()){
      if(!bastionErrors.length || bastionSuccesses.length){
        return(
          <Link to="checks" className="btn btn-raised btn-block btn-primary">Create a Check&nbsp;<ChevronRight inline={true} fill="white"/></Link>
        )
      }else{
        return (
          <Alert type="info">
            We are aware of your failed Bastion install and we will contact you via email as soon as possible. Thank you!
          </Alert>
        )
      }
    }
  },
  renderText(){
    if(!statics.checkedInstallStatus && !this.state.bastions.length){
      return (
        <p>Checking installation status...</p>
      )
    }
    if(this.bastionsComplete()){
      const bastionErrors = this.getBastionErrors();
      const bastionSuccesses = this.getBastionSuccesses();
      if(bastionErrors.length && !bastionSuccesses.length){
        return (
          <p>{bastionErrors.length > 1 ? bastionErrors.length : ''} Bastion{bastionErrors.length > 1 ? 's' : ''} failed to install correctly</p>
        )
      }else if(bastionErrors.length){
        return (
          <p>{bastionErrors.length} Bastions failed to install correctly, while {bastionSuccesses.length} completed successfully.</p>
        )
      }else{
        return (
          <p>{bastionErrors.length > 1 ? bastionErrors.length+' ' : ''}Bastion installed correctly.</p>
        )
      }
    }else{
      return (
        <p>We are now installing the bastion in your selected VPC. This could take a few minutes.</p>
      )
    }
  },
  render() {
    return (
       <div>
        <Toolbar title="Bastion Installation"/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              {this.renderText()}
              {this.state.bastions.map(b => {
                return (
                  <BastionInstaller {...b}/>
                )
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