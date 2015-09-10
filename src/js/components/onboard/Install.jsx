import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
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

const statics = {
  checkedInstallStatus:false
}

const Install = React.createClass({
  mixins: [OnboardStore.mixin, GlobalStore.mixin],
  storeDidChange(){
    // const data = OnboardStore.getFinalInstallData();
    // OnboardStore.getBastionHasLaunchedPromise().then(function(started){
    //   if(data && !started){
    //     const dataHasValues = _.chain(data).values().every(_.identity).value();
    //     if(dataHasValues && data.regions.length){
    //       OnboardActions.onboardInstall(data);
    //     }
    //   }else if(!data){
    //     router.transitionTo('onboardRegionSelect');
    //   }
    //   this.setState({checkedInstallStatus:true});
    // })
    let msgs = _.chain(GlobalStore.getSocketMessages()).filter({command:'launch-bastion'}).filter(m => {
        return m.attributes && m.attributes.ResourceType;
      }).value();
    const bastions = _.chain(msgs)
    //.reject({instance_id:'5tRx0JWEOQgGVdLoKj1W3Z'})
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
  renderBtn(){
    if(this.bastionsComplete()){
      return(
        <Link to="checks" className="btn btn-raised btn-block btn-primary">Create a Check&nbsp;<ChevronRight inline={true} fill="white"/></Link>
      )
    }
  },
  renderText(){
    if(!statics.checkedInstallStatus && !this.state.bastions.length){
      return (
        <p>Checking installation status...</p>
      )
    }
    if(this.bastionsComplete()){
      const bastionErrors = _.filter(this.bastionStatuses(), stat => stat == 'ROLLBACK_COMPLETE');
      const bastionSucccesses = _.filter(this.bastionStatuses(), stat => stat == 'CREATE_COMPLETE');
      if(bastionErrors.length && !bastionSucccesses.length){
        return (
          <p>{bastionErrors.length} Bastions failed to install correctly</p>
        )
      }else if(bastionErrors.length){
        return (
          <p>{bastionErrors.length} Bastions failed to install correctly, while {bastionSucccesses.length} completed successfully.</p>
        )
      }else{
        return (
          <p>{bastionSucccesses.length} Bastion installed correctly.</p>
        )
      }
    }else{
      return (
        <p>We are now installing the bastion in your selected VPCs. This could take a few minutes.</p>
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
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Install;