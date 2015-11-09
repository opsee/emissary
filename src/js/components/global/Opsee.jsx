import React, {PropTypes} from 'react';
import {RouteHandler} from 'react-router';
import config from '../../modules/config';
import storage from '../../modules/storage';
import {SetInterval} from '../../modules/mixins';
import {Header, MessageModal, Toolbar, Analytics} from '../global';
import DocumentTitle from 'react-document-title';
import {GlobalActions, UserActions} from '../../actions';
import {GlobalStore, UserStore, OnboardStore} from '../../stores';
import {Alert, Grid, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
/* eslint-disable no-unused-vars */
import styleGlobal from './style.global.css';
import grid from './grid.global.css';
import style from './opsee.css';
/* eslint-enable no-unused-vars */

function initialize(){
  if (UserStore.hasUser() && !GlobalStore.getSocketStarted()){
    config.intercom('boot', {app_id: 'mrw1z4dm', email: UserStore.getUser().get('email')});
    GlobalActions.globalSocketStart();
  }
  if (config.demo){
    console.info('In Demo Mode.');
  }
}
initialize();

export default React.createClass({
  mixins: [UserStore.mixin, OnboardStore.mixin, GlobalStore.mixin, SetInterval],
  propTypes: {
    query: PropTypes.object
  },
  getInitialState(){
    return {
      socketError: null,
      showNav: GlobalStore.getShowNav()
    };
  },
  componentWillMount(){
    if (this.props.query.err || storage.get('err')){
      config.error = true;
    }
  },
  componentDidMount(){
    //refresh user token every 5 minutes
    this.setInterval(UserActions.userRefreshToken, (60 * 1000 * 5));
  },
  storeDidChange(){
    const status1 = OnboardStore.getOnboardSetPasswordStatus();
    const status2 = UserStore.getUserLoginStatus();
    if (status1 === 'success' || status2 === 'success'){
      initialize();
    }
    let stateObj = {
      showNav: GlobalStore.getShowNav()
    };
    const socketError = GlobalStore.getGlobalSocketError();
    if (socketError){
      stateObj.socketError = socketError;
      setTimeout(GlobalActions.globalSocketStart, 10000);
    }else {
      stateObj.socketError = null;
    }
    this.setState(stateObj);
  },
  renderInner(){
    if (this.state.socketError && !config.debug){
      return (
        <div>
          <Toolbar title="Error"/>
          <Grid>
            <Col xs={12}>
              <Padding t={2}>
                <Alert bsStyle="danger">
                  Could not connect to Opsee. Attempting to reconnect...
                </Alert>
              </Padding>
            </Col>
          </Grid>
        </div>
      );
    }
    return (
      <RouteHandler {...this.props}/>
    );
  },
  render() {
    return (
      <div>
        <DocumentTitle title="Opsee"/>
        <Analytics id="UA-59205908-2"/>
        <Header/>
        <div className={this.state.showNav ? style.meat : style.meatUp}>
        {
          // <CSSTransitionGroup component="div" transitionName="page">
        }
          {this.renderInner()}
          {
            // <RouteHandler {...this.props} key={this.props.pathname}/>
          }
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