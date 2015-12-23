import React, {PropTypes} from 'react';
import colors from 'seedling/colors';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TimeAgo from 'react-timeago';

import {Toolbar} from '../global';
import {Checkmark, Person, Mail, Ghost} from '../icons';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Padding} from '../layout';
import {admin as actions, user as userActions, app as appActions} from '../../actions';

const Signups = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getSignups: PropTypes.func,
      activateSignup: PropTypes.func,
      getUsers: PropTypes.func
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
    this.props.actions.getUsers();
  },
  getData(){
    const signups = this.props.redux.admin.signups.toJS();
    const users = this.props.redux.admin.users.toJS();
    const combined = [].concat(signups).concat(users);
    return _.chain(combined).map(s => {
      s.created_at = new Date(Date.parse(s.created_at));
      s.userId = _.chain(users).find({email: s.email}).get('id').value();
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
  getUsers(){
    return _.filter(this.getData(), this.isUser);
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
    // this.props.appActions.modalMessageOpen({
    //   html: `${signup.email} approved.`
    // });
  },
  runGhostAccount(signup){
    this.props.userActions.logout({as: signup.userId});
  },
  renderIcon(signup){
    if (this.isUser(signup)){
      return <Person fill="textSecondary" inline/>;
    } else if (this.isApprovedSignup(signup)){
      return <Checkmark fill="textSecondary" inline/>;
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

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  userActions: bindActionCreators(userActions, dispatch),
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Signups);