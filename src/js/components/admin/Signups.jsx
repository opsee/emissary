import React, {PropTypes} from 'react';
import {plain as seed} from 'seedling';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TimeAgo from 'react-timeago';

import {Toolbar} from '../global';
import {Checkmark, Delete, Person, Mail, Ghost} from '../icons';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';
import {Heading} from '../type';
import {admin as actions, user as userActions, app as appActions} from '../../actions';

const Signups = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getSignups: PropTypes.func,
      activateSignup: PropTypes.func,
      getCustomers: PropTypes.func,
      deleteSignup: PropTypes.func,
      deleteUser: PropTypes.func
    }),
    appActions: PropTypes.shape({
      modalMessageOpen: PropTypes.func
    }),
    userActions: PropTypes.shape({
      logout: PropTypes.func
    }),
    redux: PropTypes.shape({
      admin: PropTypes.shape({
        signups: PropTypes.object,
        users: PropTypes.object
      })
    })
  },
  componentWillMount(){
    this.props.actions.getSignups();
    this.props.actions.getCustomers();
  },
  getData(){
    const signups = this.props.redux.admin.signups.toJS();
    const combined = [].concat(signups).concat(customers);
    return _.chain(combined).map(s => {
      let d = s.created_at;
      if (typeof d === 'string'){
        d = new Date(Date.parse(d));
      } else {
        d = new Date(d);
      }
      s.created_at = d;
      return s;
    }).sortBy(s => {
      return -1 * s.created_at;
    }).value();
  },
  getUnapproved(){
    return _.filter(this.getData(), this.isUnapprovedSignup);
  },
  getApproved(){
    return _.filter(this.getData(), this.isApprovedSignup);
  },
  getCustomers(){
    return this.props.redux.admin.customers.toJS();
  },
  isUnapprovedSignup(s){
    return !s.customer_id && !s.activated;
  },
  isApprovedSignup(s){
    return s.activated && !s.claimed;
  },
  isUser(s){
    return s.customer_id;
  },
  runActivateSignup(signup){
    this.props.actions.activateSignup(signup);
  },
  runGhostAccount(signup){
    this.props.userActions.logout({as: signup.id});
  },
  runDeleteSignup(signup){
    /*eslint-disable no-alert*/
    if (window.confirm(`Delete ${signup.email} (#${signup.id})?`)){
      this.props.actions.deleteSignup(signup);
    }
  },
  /*eslint-disable no-unused-vars*/
  runDeleteUser(user){
  /*eslint-enable no-unused-vars*/
    return window.alert('this does nothing right now');
    // if (window.confirm(`Delete ${user.email} (#${user.userId})?`)){
    //   this.props.actions.deleteUser(user);
    // }
    /*eslint-enable no-alert*/
  },
  renderIcon(signup){
    if (this.isUser(signup)){
      return <Person fill="textSecondary" inline/>;
    } else if (this.isApprovedSignup(signup)){
      return <Checkmark fill="textSecondary" inline/>;
    }
    return null;
  },
  renderButton(signup){
    if (this.isUnapprovedSignup(signup)){
      return (
        <div className="display-flex">
          <div className="flex-1">
            <Button flat color="danger" sm onClick={this.runDeleteSignup.bind(null, signup)} title="Delete this signup"><Delete fill="danger"/></Button>
          </div>
          <div>
            <Button flat color="success" onClick={this.runActivateSignup.bind(null, signup)}><Checkmark fill="success" inline/> Activate</Button>
          </div>
        </div>
      );
    } else if (this.isApprovedSignup(signup)) {
      return (
        <div className="display-flex">
          <div className="flex-1">
            <Button flat color="danger" sm onClick={this.runDeleteSignup.bind(null, signup)} title="Delete this signup"><Delete fill="danger"/></Button>
          </div>
          <div>
            <Button flat color="primary" onClick={this.runActivateSignup.bind(null, signup)}><Mail fill="primary" inline/> Resend Email</Button>
          </div>
        </div>
      );
    }
    return (
      <div className="display-flex">
          <div className="flex-1">
            <Button flat color="danger" sm onClick={this.runDeleteUser.bind(null, signup)} title="Delete this user"><Delete fill="danger"/></Button>
          </div>
          <div>
            <Button flat color="warning" onClick={this.runGhostAccount.bind(null, signup)}><Ghost fill="warning" inline/> Ghost</Button>
          </div>
        </div>
    );
  },
  renderItem(signup){
    return (
      <Col xs={12} sm={6} key={`signup-${_.uniqueId()}`}>
        <Padding tb={1}>
          <div style={{background: seed.color.gray9}}>
            <Padding a={1}>
              <Heading level={3}>
                {this.renderIcon(signup)} {signup.name}
              </Heading>
              <Padding b={1}>
                <div>
                  <a href={'mailto:' + signup.email}>{signup.email}</a>
                  {signup.admin ? '  [admin]' : ''}
                </div>
                <span>#{`${signup.userId || signup.id}`} - <TimeAgo date={signup.created_at}/></span>
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
  renderCustomer(customer){
    return (
      <Col xs={12} sm={6} key={`customer-${_.uniqueId()}`}>
        <Padding tb={1}>
          <div style={{background: seed.color.gray9}}>
            <Padding a={1}>
              <Heading level={3}>
                {this.renderIcon(customer)} {customer.name}
              </Heading>
              <Padding b={1}>
                <div>
                  <a href={'mailto:' + customer.email}>{customer.email}</a>
                  {customer.admin ? '  [admin]' : ''}
                </div>
                <span>#{`${customer.userId || customer.id}`} - <TimeAgo date={customer.created_at}/></span>
              </Padding>
              <div>
                {this.renderButton(customer)}
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
                <Heading level={3}>Unapproved</Heading>
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
                <Heading level={3}><Checkmark fill={seed.color.text2} inline/> Approved</Heading>
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
                <Heading level={3}><Person fill={seed.color.text2} inline/> Customers</Heading>
                <div className="display-flex-sm flex-wrap">
                  {this.getCustomers().map(this.renderItem)}
                </div>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  userActions: bindActionCreators(userActions, dispatch),
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Signups);