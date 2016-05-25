import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import {Checkmark} from '../icons';
import {onboard as actions} from '../../actions';
import {Alert, Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import NotificationSelection from '../checks/NotificationSelection';
import style from './onboard.css';

const Notifications = React.createClass({
  propTypes: {
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        onboardGetDefaultNotif: PropTypes.object,
        onboardSetDefaultNotif: PropTypes.object
      })
    }),
    actions: PropTypes.shape({
      getDefaultNotification: PropTypes.func,
      setDefaultNotification: PropTypes.func,
      skipDefaultNotifications: PropTypes.func
    })
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  componentWillMount(){
    this.props.actions.getDefaultNotification();
  },
  componentWillReceiveProps(nextProps){
    // Always use the *actual* notifs if there are any, but store in state to track
    // any notifs that are added (in the NotificationSelection component)
    // but not yet persisted
    if (nextProps.redux.onboard.defaultNotifs) {
      this.setState({ notifications: nextProps.redux.onboard.defaultNotifs });
    }
    if (nextProps.redux.asyncActions.onboardSetDefaultNotif.status === 'success') {
      // Set a timer so success state can render
      setTimeout(() => {
        this.context.router.push('/start/install');
      }, 500);
    }
  },
  getInitialState(){
    return {
      notifications: []
    };
  },
  onChange(notifications){
    this.setState({ notifications });
  },
  onSave(){
    this.props.actions.setDefaultNotification(this.state.notifications);
  },
  renderError(){
    const {status} = this.props.redux.asyncActions.onboardSetDefaultNotif;
    if (status === null || typeof status !== 'object') {
      return null;
    }
    return (
      <Padding b={2}>
        <Alert color="danger">
          Whoops, an error occurred when trying to save your notifications! A bug report has been filed for you. If you need to contact support, check out our <Link to="/help" style={{color: 'white', textDecoration: 'underline'}}>help page</Link>.
        </Alert>
      </Padding>
    );
  },
  renderSaveButton(){
    const {status} = this.props.redux.asyncActions.onboardSetDefaultNotif;
    const isDisabled = status === 'pending' || status === 'success' || !_.size(this.state.notifications);
    let innerButton;
    if (status === 'success') {
      innerButton = <Checkmark btn />;
    } else if (status === 'pending') {
      innerButton = 'Saving notification preferences...';
    } else {
      innerButton = 'Save notification preferences';
    }
    return (
      <Padding b={1}>
        <Button onClick={this.onSave} disabled={isDisabled} color="primary" block>{innerButton}</Button>
      </Padding>
    );
  },
  render(){
    return (
      <div className={style.transitionPanel}>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding tb={2}>
                <div className={style.headerStep}>STEP 3 of 3</div>
                <h2>Set up default alerts</h2>
              </Padding>
              <p>When your health checks fail, Opsee will let you know. (You can always configure this on a per-check basis.)</p>
              <Padding tb={1}>
                <p>Where should we send your alerts by default?</p>
              </Padding>
              <Padding t={1}>
                <NotificationSelection onChange={this.onChange} notifications={this.props.redux.onboard.defaultNotifs} />
              </Padding>
              {this.renderError()}
              {this.renderSaveButton()}
              <p className="text-center"><small><Link to="/start/install" onClick={this.props.actions.skipDefaultNotifications}>Set up default notifications later</Link></small></p>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);