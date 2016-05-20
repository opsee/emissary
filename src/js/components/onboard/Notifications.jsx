import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {History} from 'react-router';

import {onboard as actions} from '../../actions';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import NotificationSelection from '../checks/NotificationSelection';
import devices from '../svgs/devices.svg';
import style from './onboard.css';

const Notifications = React.createClass({
  mixins: [History],
  propTypes: {
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        onboardGetDefaultNotif: PropTypes.object,
        onboardSetDefaultNotif: PropTypes.object
      })
    }),
    actions: PropTypes.shape({
      getDefaultNotification: PropTypes.func,
      setDefaultNotification: PropTypes.func
    })
  },
  componentWillMount(){
    this.props.actions.getDefaultNotification();
  },
  componentWillReceiveProps(nextProps){
    if (nextProps.redux.onboard.defaultNotification) {
      this.history.pushState(null, '/start/postinstall');
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
  render(){
    const isSavePending = this.props.redux.asyncActions.onboardSetDefaultNotif.status === 'pending';
    const isDisabled = isSavePending || !this.state.notifications.length;
    return (
      <div className={style.transitionPanel}>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding t={4} b={1} className="text-center">
                <img src={devices} className={style.laptop} />
              </Padding>
              <Padding tb={2}>
                <h2>Where should we send your alerts?</h2>
              </Padding>
              <p>When your health checks fail, Opsee will let you know. You can always
              configure this on a per-check basis.</p>

              <Padding t={1}>
                <NotificationSelection onChange={this.onChange} exclusive />
              </Padding>
              <Button onClick={this.onSave} disabled={isDisabled} color="primary" block>{isSavePending ? 'Saving' : 'Save'} notification preferences{isSavePending ? '...' : ''}</Button>
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