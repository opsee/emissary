import React from 'react/addons';
const {CSSTransitionGroup} = React.addons;
import {RouteHandler} from 'react-router';
import router from '../../modules/router';
import config from '../../modules/config';
import {Header, MessageModal} from '../global';
import DocumentTitle from 'react-document-title';
import {GlobalActions} from '../../actions';
import {GlobalStore, UserStore, OnboardStore} from '../../stores';
import GoogleAnalytics from 'react-g-analytics';

function initialize(){
  let user = UserStore.getUser();
  if(user.get('token') && !GlobalStore.getSocketStarted()){
    GlobalActions.globalSocketStart();
  }
  if(config.demo){
    console.info('In Demo Mode.');
  }
}

initialize();

export default React.createClass({
  mixins: [UserStore.mixin, OnboardStore.mixin],
  storeDidChange(){
    const status1 = OnboardStore.getSetPasswordStatus();
    const status2 = UserStore.getUserLoginStatus();
    if(status1 == 'success' || status2 == 'success'){
      initialize();
    }
  },
  componentWillMount(){
    if(this.props.query.err){
      config.error = true;
    }
  },
  render() {
    console.log(this.props.query);
    return (
      <div>
        <DocumentTitle title="Opsee"/>
        <GoogleAnalytics id="UA-59205908-2"/>
        <Header/>
        <div style={{position:'relative'}}>
        {
          // <CSSTransitionGroup component="div" transitionName="page">
          // <RouteHandler {...this.props} key={this.props.pathname}/>
        }
            <RouteHandler {...this.props}/>
        {
          // </CSSTransitionGroup>
        }
        </div>
        {
        // <RouteHandler/>
        }
        <MessageModal/>
      </div>
    );
  }
});