import React from 'react';
import router from '../../modules/router';
import colors from 'seedling/colors';
import _ from 'lodash';
import {Toolbar} from '../global';
import {AdminActions, GlobalActions, UserActions} from '../../actions';
import {AdminStore} from '../../stores';
import {Checkmark, Person, Mail, Ghost} from '../icons';
import TimeAgo from 'react-timeago';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';

export default React.createClass({
  mixins: [AdminStore.mixin],
  getInitialState(){
    return this.getState();
  },
  componentWillMount(){
    AdminActions.adminGetSignups();
  },
  storeDidChange() {
    const data = this.getState();
    this.setState(data);
    if (data.approveStatus === 'success'){
      AdminActions.adminGetSignups();
      GlobalActions.globalModalMessage({
        html: 'User activated. Email sent.',
        style: 'success'
      });
    }
  },
  getData(){
    const signups = AdminStore.getSignups().toJS();
    return _.chain(signups).map(s => {
      s.created_at = new Date(Date.parse(s.created_at));
      return s;
    }).sortBy(s => {
      return -1 * s.created_at;
    }).value();
  },
  getState(){
    return {
      signups: this.getData(),
      approveStatus: AdminStore.getAdminActivateSignupStatus()
    };
  },
  getUnapproved(){
    return _.filter(this.state.signups, this.isUnapprovedSignup);
  },
  getApproved(){
    return _.filter(this.state.signups, this.isApprovedSignup);
  },
  getUsers(){
    return _.filter(this.state.signups, this.isUser);
  },
  isUnapprovedSignup(s){
    return !s.claimed && !s.activated;
  },
  isApprovedSignup(s){
    return s.activated && !s.claimed;
  },
  isUser(s){
    return s.claimed;
  },
  runActivateSignup: AdminActions.adminActivateSignup,
  runGhostAccount(signup){
    UserActions.userLogOut();
    //revisit this, params isn't working so using query atm
    router.transitionTo('login', null, {as: signup.id});
  },
  renderIcon(signup){
    if (this.isUser(signup)){
      return <Person fill={colors.textColorSecondary} inline/>;
    } else if (this.isApprovedSignup(signup)){
      return <Checkmark fill={colors.textColorSecondary} inline/>;
    }
    return <span/>;
  },
  renderButton(signup){
    if (this.isUnapprovedSignup(signup)){
      return (
        <Button flat color="success" onClick={this.runActivateSignup.bind(null, signup)}><Checkmark fill="success" inline/> Activate</Button>
      );
    } else if (this.isApprovedSignup(signup)) {
      return (
        <Button flat color="primary" onClick={this.runActivateSignup.bind(null, signup)}><Mail fill="primary" inline/> Resend Activation Email</Button>
      );
    }
    return (
      <Button flat color="danger" onClick={this.runGhostAccount.bind(null, signup)}><Ghost fill="danger" inline/> Ghost</Button>
    );
  },
  renderItem(signup){
    return (
      <Col xs={12} sm={6}>
        <Padding tb={1}>
          <div className="bg-gray-900 md-shadow-bottom-z-1">
            <Padding a={1}>
              <h3>
                {this.renderIcon(signup)} {signup.name}
              </h3>
              <Padding b={1}>
                <div><a href={'mailto:' + signup.email}>{signup.email}</a></div>
                <span>#{signup.id} - <TimeAgo date={signup.created_at}/></span>
              </Padding>
              <div>
                {this.renderButton(signup)}
              </div>
            </Padding>
          </div>
        </Padding>
      </Col>
    );
  },
  render() {
    return (
      <div>
        <Toolbar title="Signups"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={1}>
                <h3>Unapproved</h3>
                <div className="display-flex-sm flex-wrap">
                  {this.getUnapproved().map(this.renderItem)}
                </div>
              </Padding>
            </Col>
          </Row>
          <hr/>
          <Row>
            <Col xs={12}>
              <Padding b={1}>
                <h3><Checkmark fill={colors.textColorSecondary} inline/> Approved</h3>
                <div className="display-flex-sm flex-wrap">
                  {this.getApproved().map(this.renderItem)}
                </div>
              </Padding>
            </Col>
          </Row>
          <hr/>
          <Row>
            <Col xs={12}>
              <Padding b={1}>
                <h3><Person fill={colors.textColorSecondary} inline/> Users</h3>
                <div className="display-flex-sm flex-wrap">
                  {this.getUsers().map(this.renderItem)}
                </div>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});