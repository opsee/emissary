import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import NotificationSelection from './NotificationSelection';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

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
      getChecks: PropTypes.func.isRequired
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
        getChecks: PropTypes.object,
        checkDelete: PropTypes.object
      })
    })
  },
  getInitialState() {
    return {
      notifications: this.getInitialNotifications()
    };
  },
  getSelectedChecks(){
    const data = this.props.redux.checks.checks;
    const checks = data.toJS ? data.toJS() : data;
    return _.filter(checks, check => check.selected);
  },
  getInitialNotifications(){
    return _.chain(this.getSelectedChecks())
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
      return _.assign(check, this.state, {
        'check-id': check.id
      });
    });
    this.props.actions.multiEditNotifications(checks);
  },
  renderInner(){
    if (this.getSelectedChecks().length){
      return (
        <BastionRequirement>
          <Alert>Here you can bulk-edit notifications for selected checks. All notifications for every selected check will be replaced with the data below.</Alert>
          <Padding b={2} t={2}>
            <CheckItemList title selected/>
          </Padding>
          <NotificationSelection {...this.state} onChange={this.handleChange}/>
          <Button onClick={this.handleEdit} color="success" block disabled={this.isDisabled()}>Set All Notifications</Button>
        </BastionRequirement>
      );
    }
    return (
      <div>
        You must select at least 1 check to edit notifications.
      </div>
    );
  },
  render() {
    return (
      <div>
        <Toolbar title="Edit Check Notifications">
          <Button color="primary" fab to="/check-create" title="Create New Check">
            <Add btn/>
          </Button>
        </Toolbar>
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