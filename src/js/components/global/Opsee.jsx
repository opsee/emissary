import React, {PropTypes} from 'react';
import _ from 'lodash';
import config from '../../modules/config';
import {SetInterval} from '../../modules/mixins';
import {Analytics, Header, MessageModal, Toolbar} from '../global';
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

const hideNavList = ['^\/start', '^\/login', '^\/check-create', '^\/check\/edit', '^\/profile\/edit', '^\/password-forgot'];

function initialize(){
  if (UserStore.hasUser() && !window.userRefreshTokenInterval){
    window.Intercom('boot', {
      app_id: 'mrw1z4dm',
      email: UserStore.getUser().get('email'),
      user_hash: UserStore.getUser().get('intercom_hmac')
    });
    GlobalActions.globalSocketStart();
    //refresh user token every 5 minutes
    window.userRefreshTokenInterval = setInterval(UserActions.userRefreshToken, (60 * 1000 * 5));
  }
  if (config.demo){
    console.info('In Demo Mode.');
  }
}
initialize();

export default React.createClass({
  mixins: [UserStore.mixin, OnboardStore.mixin, GlobalStore.mixin, SetInterval],
  propTypes: {
    location: PropTypes.object,
    children: PropTypes.node
  },
  getInitialState(){
    return {
      socketError: null,
      showNav: GlobalStore.getShowNav()
    };
  },
  componentWillMount(){
    if (this.props.location.query.err){
      config.error = true;
    }
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
  getMeatClass(){
    return this.shouldHideNav() ? style.meatUp : style.meat;
  },
  shouldHideNav(){
    return !!(_.find(hideNavList, string => this.props.location.pathname.match(string)));
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
    return this.props.children;
  },
  render() {
    return (
      <div>
        <DocumentTitle title="Opsee"/>
        <Header hide={this.shouldHideNav()}/>
        <Analytics/>
        <div className={this.getMeatClass()}>
        {
          // <CSSTransitionGroup component="div" transitionName="page">
        }
          {this.renderInner()}
        {
          // </CSSTransitionGroup>
        }
        </div>
        <MessageModal/>
      </div>
    );
  }
});