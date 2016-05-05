import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import NotificationSelection from './NotificationSelection';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import {is} from 'immutable';

import {BastionRequirement, Toolbar, StatusHandler} from '../global';
import {Add} from '../icons';
import {UserDataRequirement} from '../user';
import CheckItemList from './CheckItemList.jsx';
import {Button} from '../forms';
import {Heading} from '../type';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {checks as actions} from '../../actions';

const MultiEditNotifications = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getChecksNotifications: PropTypes.func.isRequired
    }),
    userActions: PropTypes.shape({
      putData: PropTypes.func
    }),
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        checks: PropTypes.object
      }),
      env: PropTypes.shape({
        bastions: PropTypes.array
      }),
      asyncActions: PropTypes.shape({
        getChecksNotifications: PropTypes.object,
        checkDelete: PropTypes.object
      })
    })
  },
  componentWillMount(){
    this.props.actions.getChecksNotifications();
  },
  componentWillReceiveProps(nextProps) {
    if (!is(nextProps.redux.checks.checks, this.props.redux.checks.checks)){
      this.setState({
        notifications: this.getNotifications(nextProps)
      });
    }
  },
  getInitialState() {
    return {
      notifications: this.getNotifications()
    };
  },
  getSelectedChecks(props = this.props){
    const data = props.redux.checks.checks;
    const checks = data.toJS ? data.toJS() : data;
    return _.filter(checks, check => check.selected);
  },
  getNotifications(props = this.props){
    return _.chain(this.getSelectedChecks(props))
    .map('notifications')
    .flatten()
    .uniqBy(notif => {
      return notif.key + notif.value;
    })
    .value() || [];
  },
  getNumberIncomplete(){
    return _.reject(this.state.notifications, n => {
      return n.type && n.value;
    });
  },
  isDisabled(){
    return !!(this.state.notifications.length < 1 || this.getNumberIncomplete().length);
  },
  handleChange(notifications){
    this.setState({
      notifications
    });
  },
  handleEdit(){
    const checks = this.getSelectedChecks().map(check => {
      return _.assign(check, this.state);
    });
    this.props.actions.multiEditNotifications(checks);
  },
  renderInner(){
    const checks = this.getSelectedChecks();
    if (checks.length && _.find(checks[0].tags, t => 'notifications')){
      return (
        <StatusHandler status={this.props.redux.asyncActions.getChecksNotifications.status}>
          <BastionRequirement>
            <Alert>Here you can bulk-edit notifications for selected checks. All notifications for every selected check will be replaced with the data below.</Alert>
            <Padding b={2} t={2}>
              <CheckItemList title selected noFetch/>
            </Padding>
            <NotificationSelection notifications={this.state.notifications} onChange={this.handleChange}/>
            <Button onClick={this.handleEdit} color="success" block disabled={this.isDisabled()}>Set All Notifications</Button>
          </BastionRequirement>
        </StatusHandler>
      );
    }
    return (
      <StatusHandler status={this.props.redux.asyncActions.getChecksNotifications.status}>
        You must select at least 1 check to edit notifications.
      </StatusHandler>
    );
  },
  render() {
    return (
      <div>
        <Toolbar title="Edit Check Notifications"/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderInner()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(MultiEditNotifications);