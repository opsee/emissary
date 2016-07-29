import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import config from '../../modules/config';
import {SetInterval} from '../../modules/mixins';
import {AppStatus, Analytics, Confirm, Header, Toolbar} from './';
import DocumentTitle from 'react-document-title';
import {Alert, Col, Grid, Padding} from '../layout';
/* eslint-disable no-unused-vars */
import {yeller} from '../../modules';

import reset from './reset.css';
import style from './global.css';
import modal from './modal.css';
import autosuggest from './autosuggest.css';
import forms from '../forms/forms.css';
import grid from '../layout/grid.css';
import layout from '../layout/layout.css';

import {
  app as appActions,
  user as userActions,
  env as envActions,
  checks as checkActions,
  team as teamActions
} from '../../actions';
import {Bar as SearchBar} from '../search';
/* eslint-enable no-unused-vars */

const fullScreenList = ['^\/start', '^\/login'];

const hideNavList = [
  '^\/check-create',
  '^\/check\/edit',
  '^\/check\/.*\/event',
  '^\/profile\/edit',
  '^\/password-forgot',
  '^\/team\/edit',
  '^\/team\/create',
  '^\/team\/member\/invite',
  '^\/team\/member\/.*\/edit',
  '^\/welcome'
];

const Opsee = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    location: PropTypes.object,
    children: PropTypes.node,
    appActions: PropTypes.shape({
      initialize: PropTypes.func,
      shutdown: PropTypes.func,
      getStatusPageInfo: PropTypes.func
    }),
    checkActions: PropTypes.shape({
      getChecks: PropTypes.func
    }),
    userActions: PropTypes.shape({
      refresh: PropTypes.func
    }),
    redux: PropTypes.object,
    envActions: PropTypes.shape({
      getBastions: PropTypes.func.isRequired
    }),
    teamActions: PropTypes.shape({
      getTeam: PropTypes.func.isRequired
    }).isRequired
  },
  componentWillMount(){
    this.props.appActions.initialize();
    this.props.userActions.refresh();
    this.setInterval(this.props.userActions.refresh, (1000 * 60 * 14));
    this.props.appActions.getStatusPageInfo();
    this.setInterval(this.props.appActions.getStatusPageInfo, (1000 * 60 * 2));
    this.props.envActions.getBastions();
    if (this.props.redux.user.get('auth')){
      this.props.checkActions.getChecks();
      this.props.teamActions.getTeam();
    }
    yeller.configure(this.props.redux);
  },
  componentWillReceiveProps(nextProps) {
    const hasAuth = !!this.props.redux.user.get('auth');
    const willHaveAuth = !!nextProps.redux.user.get('auth');

    if (hasAuth && !willHaveAuth) { //user log out
      this.props.appActions.shutdown();
    } else if (!hasAuth && willHaveAuth) { //user log in
      this.props.appActions.initialize();
      this.props.checkActions.getChecks();
    }
  },
  getMeatClass(){
    console.log(this.shouldHideNav());
    return this.shouldHideNav() ? style.meatUp : style.meat;
  },
  shouldFullScreen() {
    return !!(_.find(fullScreenList, string => this.props.location.pathname.match(string)));
  },
  shouldHideNav(){
    return !!(_.find(hideNavList, string => this.props.location.pathname.match(string)));
  },
  shouldShowIntercom(){
    const isStartRoute = _.some(['/start'].map(string => this.props.location.pathname.match(string)));
    return (isStartRoute && this.props.redux.app.intercomStatus !== 'visible');
  },
  renderSocketError(){
    return (
      <div>
        <Toolbar title="Error"/>
        <Grid>
          <Col xs={12}>
            <Padding t={2}>
              <Alert color="danger">
                Could not connect to Opsee. Attempting to reconnect...
              </Alert>
            </Padding>
          </Col>
        </Grid>
      </div>
    );
  },
  renderInner(){
    if (!this.props.redux.app.ready || this.props.redux.env.vpc === undefined){
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
        <AppStatus/>
        {this.shouldFullScreen() ? null :
          <div>
            <Header hide={this.shouldHideNav()}/>
            <div id="header-search">
              <SearchBar/>
            </div>
          </div>
        }
        <div className={this.getMeatClass()}>
          {this.renderInner()}
        </div>
        <a id="Intercom" href="mailto:@incoming.intercom.io" className={style.intercom} style={{display: this.shouldShowIntercom() ? 'block' : 'none'}}/>
        <Confirm />
        <Analytics/>
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
  envActions: bindActionCreators(envActions, dispatch),
  checkActions: bindActionCreators(checkActions, dispatch),
  teamActions: bindActionCreators(teamActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Opsee);