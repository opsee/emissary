import React, {PropTypes} from 'react/addons';
import {RouteHandler} from 'react-router';
import config from '../../modules/config';
import storage from '../../modules/storage';
import {Header, MessageModal} from '../global';
import DocumentTitle from 'react-document-title';
import {GlobalActions, UserActions} from '../../actions';
import {GlobalStore, UserStore, OnboardStore} from '../../stores';
import GoogleAnalytics from 'react-g-analytics';
import {Alert, Grid, Col} from '../../modules/bootstrap';
/* eslint-disable no-unused-vars */
import styleGlobal from './style.global.css';
import grid from './grid.global.css';
import style from './opsee.css';
/* eslint-enable no-use-before-define */

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

let refreshInterval;

export default React.createClass({
  mixins: [UserStore.mixin, OnboardStore.mixin, GlobalStore.mixin],
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
    //refresh user token every 14 minutes
    refreshInterval = setInterval(UserActions.userRefreshToken, (60 * 1000 * 14));
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
    }
    this.setState(stateObj);
  },
  renderInner(){
    if (this.state.socketError && !config.debug){
      return (
        <Grid>
          <Col xs={12}>
          <div><br/></div>
            <Alert bsStyle="danger">
              Could not connect to Opsee.
            </Alert>
          </Col>
        </Grid>
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
        <GoogleAnalytics id="UA-59205908-2"/>
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