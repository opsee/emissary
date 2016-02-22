import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import config from '../../modules/config';
import {SetInterval} from '../../modules/mixins';
import {Analytics, Header, MessageModal, Toolbar} from './';
import DocumentTitle from 'react-document-title';
import {Alert, Grid, Col} from '../../modules/bootstrap';
import {Padding} from '../layout';
/* eslint-disable no-unused-vars */
import {yeller} from '../../modules';

import reset from './reset.css';
import styleGlobal from './global.css';
import grid from './grid.css';
import style from './opsee.css';
import alert from './alert.css';
import modal from './modal.css';

import {app as appActions, user as userActions, env as envActions} from '../../actions';
import {Bar as SearchBar} from '../search';
/* eslint-enable no-unused-vars */

const hideNavList = ['^\/start', '^\/login', '^\/check-create', '^\/check\/edit', '^\/profile\/edit', '^\/password-forgot'];

const Opsee = React.createClass({
  mixins: [SetInterval],
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
    redux: PropTypes.object,
    envActions: PropTypes.shape({
      getBastions: PropTypes.func.isRequired
    })
  },
  componentWillMount(){
    this.props.appActions.initialize();
    this.setInterval(this.props.userActions.refresh, (1000 * 60 * 14));
    yeller.configure(this.props.redux);
  },
  componentWillReceiveProps(nextProps) {
    //user log out
    if (!nextProps.redux.user.get('auth') && this.props.redux.user.get('auth')){
      this.props.appActions.shutdown();
    }
    //user log in
    if (nextProps.redux.user.get('auth') && !this.props.redux.user.get('auth')){
      this.props.appActions.initialize();
      this.props.envActions.getBastions();
    }
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
      return null;
    }
    if (this.props.redux.app.socketError && !config.bypassSocketError){
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
        <div id="header-search">
          <SearchBar />
        </div>
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

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  appActions: bindActionCreators(appActions, dispatch),
  userActions: bindActionCreators(userActions, dispatch),
  envActions: bindActionCreators(envActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Opsee);
