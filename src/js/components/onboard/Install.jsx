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

const Team = React.createClass({
  mixins: [OnboardStore.mixin, GlobalStore.mixin],
  storeDidChange(){
    const data = OnboardStore.getInstallData();
    const dataHasValues = _.chain(data).values().every(_.identity).value();
    if(dataHasValues && data.regions.length && data.vpcs.length){
      // router.transitionTo('onboardInstall');
    }
    let msgs = _.filter(GlobalStore.getSocketMessages(),{command:'launch-bastion'});
    const bastions = _.chain(msgs)
    // .reject({instance_id:"5tRx0JWEOQgGVdLoKj1W3Z"})
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
      // const data = OnboardStore.getInstallData();
      // const dataHasValues = _.chain(data).values().every(_.identity).value();
      // if(!dataHasValues || !data.regions.length){
      //   transition.redirect('onboardRegionSelect');
      // }
    }
  },
  getInitialState() {
    var self = this;
    const obj = {
      bastions:[]
    }
    return obj;
  },
  componentWillMount(){
    // OnboardActions.onboardInstall();
    OnboardActions.onboardExampleInstall();
  },
  disabled(){
    return !this.state.info.cleanedData.vpcs;
  },
  bastionsComplete(){
    return false;
  },
  renderBtn(){
    if(this.bastionsComplete()){
      return(
        <Link to="checks" className="btn btn-raised btn-block btn-primary">Create a Check&nbsp;<ChevronRight inline={true} fill="white"/></Link>
      )
    }
  },
  render() {
    return (
       <div>
        <Toolbar title="Bastion Installation"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <p>We are now installing the bastion in your selected VPCs. This could take a few minutes.</p>
              {this.state.bastions.map(b => {
                return (
                  <BastionInstaller {...b}/>
                )
              })}
              {this.renderBtn()}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Team;