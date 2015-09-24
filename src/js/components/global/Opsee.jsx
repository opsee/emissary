import React from 'react/addons';
const {CSSTransitionGroup} = React.addons;
import {RouteHandler} from 'react-router';
import router from '../../modules/router';
import config from '../../modules/config';
import storage from '../../modules/storage';
import {Header, MessageModal} from '../global';
import DocumentTitle from 'react-document-title';
import {GlobalActions} from '../../actions';
import {GlobalStore, UserStore, OnboardStore} from '../../stores';
import GoogleAnalytics from 'react-g-analytics';
import {Alert, Grid, Col, Row} from '../../modules/bootstrap';

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
  mixins: [UserStore.mixin, OnboardStore.mixin, GlobalStore.mixin],
  storeDidChange(){
    const status1 = OnboardStore.getSetPasswordStatus();
    const status2 = UserStore.getUserLoginStatus();
    if(status1 == 'success' || status2 == 'success'){
      initialize();
    }
    const socketError = GlobalStore.getGlobalSocketError();
    if(socketError){
      this.setState({socketError});
    }
  },
  getInitialState(){
    return {
      socketError:null
    }
  },
  componentWillMount(){
    if(this.props.query.err || storage.get('err')){
      config.error = true;
    }
  },
  renderInner(){
    if(this.state.socketError){
      return (
        <Grid>
          <Col xs={12}>
          <div><br/></div>
            <Alert bsStyle="danger">
              Could not connect to Opsee.
            </Alert>
          </Col>
        </Grid>
      )
    }else{
      return (
        <RouteHandler {...this.props}/>
      )
    }
  },
  render() {
    return (
      <div>
        <DocumentTitle title="Opsee"/>
        <GoogleAnalytics id="UA-59205908-2"/>
        <Header/>
        <div style={{position:'relative'}}>
          {this.renderInner()}
        {
          // <CSSTransitionGroup component="div" transitionName="page">
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