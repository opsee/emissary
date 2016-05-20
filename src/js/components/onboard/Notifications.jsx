import _ from 'lodash';
import React from 'react';
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
  getInitialState(){
    return {
      notification: null
    };
  },
  onChange(notifications){
    const notification = _.first(notifications);
    this.setState({ notification });
  },
  onSave(){
    console.log('TODO graphql');
    console.log(this.state);
    this.history.pushState(null, '/start/postinstall');
  },
  render(){
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
              <p>Choose one of the notification channels below to set it as your default:</p>
              <Padding t={1}>
                <NotificationSelection onChange={this.onChange} hideText />
              </Padding>
              <Button onClick={this.onSave} color="primary" block>Save notification preferences</Button>
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