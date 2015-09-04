import React from 'react/addons';
const {CSSTransitionGroup} = React.addons;
import {RouteHandler} from 'react-router';
import router from '../../modules/router';
import {Header, MessageModal} from '../global';
import DocumentTitle from 'react-document-title';
import {GlobalActions} from '../../actions';
import {GlobalStore, UserStore, OnboardStore} from '../../stores';
import GoogleAnalytics from 'react-g-analytics';

function startSocket(){
  let user = UserStore.getUser();
  if(user.get('token') && !GlobalStore.getSocketStarted()){
    GlobalActions.globalSocketStart();
  }
}

startSocket();

export default React.createClass({
  mixins: [UserStore.mixin, OnboardStore.mixin],
  storeDidChange(){
    const status1 = OnboardStore.getSetPasswordStatus();
    const status2 = UserStore.getUserLoginStatus();
    if(status1 == 'success' || status2 == 'success'){
      startSocket();
    }
  },
  render() {
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