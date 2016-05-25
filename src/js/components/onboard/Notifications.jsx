import _ from 'lodash';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {onboard as actions} from '../../actions';
import {Col, Grid, Padding, Row} from '../layout';
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
      setDefaultNotification: PropTypes.func
    })
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  componentWillMount(){
    this.props.actions.getDefaultNotification();
  },
  componentWillReceiveProps(nextProps){
    // A non-null value for default notifications means that the notifications
    // step has either been completed or skipped (if the array is empty).
    if (!!nextProps.redux.onboard.defaultNotifs) {
      this.context.router.push('/start/install');
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
              <Padding tb={2}>
                <div className={style.headerStep}>STEP 3 of 3</div>
                <h2>Set up default alerts</h2>
              </Padding>
              <p>When your health checks fail, Opsee will let you know. (You can always configure this on a per-check basis.)</p>
              <Padding tb={1}>
                <p>Where should we send your alerts by default?</p>
              </Padding>
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