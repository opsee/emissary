import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import config from '../../modules/config';
import {SetInterval} from '../../modules/mixins';
import {Analytics, Header, MessageModal, Toolbar} from './';
import DocumentTitle from 'react-document-title';
import {GlobalStore} from '../../stores';
import {Alert, Grid, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
/* eslint-disable no-unused-vars */
import styleGlobal from './style.global.css';
import grid from './grid.global.css';
import style from './opsee.css';
import {app as appActions} from '../../reduxactions';
import {user as userActions} from '../../reduxactions';
/* eslint-enable no-unused-vars */

const hideNavList = ['^\/start', '^\/login', '^\/check-create', '^\/check\/edit', '^\/profile\/edit', '^\/password-forgot'];

const Opsee = React.createClass({
  mixins: [GlobalStore.mixin, SetInterval],
  propTypes: {
    location: PropTypes.object,
    children: PropTypes.node,
    appActions: PropTypes.shape({
      initialize: PropTypes.func,
      shutdown: PropTypes.func
    }),
    userActions: PropTypes.shape({
      refresh: PropTypes.func
    }),
    redux: PropTypes.object
  },
  getInitialState(){
    return {
      showNav: GlobalStore.getShowNav()
    };
  },
  componentWillMount(){
    this.props.appActions.initialize();
    this.setInterval(this.props.userActions.refresh, (1000 * 60 * 15));
  },
  componentWillReceiveProps(nextProps) {
    //user log out
    if (!nextProps.redux.user.get('auth') && this.props.redux.user.get('auth')){
      this.props.appActions.shutdown();
    }
    //user log in
    if (nextProps.redux.user.get('auth') && !this.props.redux.user.get('auth')){
      this.props.appActions.initialize();
    }
  },
  storeDidChange(){
    let stateObj = {
      showNav: GlobalStore.getShowNav()
    };
    this.setState(stateObj);
  },
  getMeatClass(){
    return this.shouldHideNav() ? style.meatUp : style.meat;
  },
  shouldHideNav(){
    return !!(_.find(hideNavList, string => this.props.location.pathname.match(string)));
  },
  renderSocketError(){
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
  },
  renderInner(){
    if (!this.props.redux.app.ready){
      return <div/>;
    }
    if (this.props.redux.app.socketError && !config.debug){
      return this.renderSocketError();
    }
    return React.cloneElement(this.props.children, _.assign({},
      {
        redux: this.props.redux
      })
    );
  },
  render() {
    return (
      <div>
        <DocumentTitle title="Opsee"/>
        <Header user={this.props.redux.user} hide={this.shouldHideNav()}/>
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

const mapDispatchToProps = (dispatch) => ({
  appActions: bindActionCreators(appActions, dispatch),
  userActions: bindActionCreators(userActions, dispatch)
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps, mapDispatchToProps)(Opsee);