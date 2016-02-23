import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Map} from 'immutable';
import TimeAgo from 'react-timeago';

import {checks as actions} from '../../actions';
import {Grid, Row, Col} from '../../modules/bootstrap';
import Padding from '../layout/Padding';
import {Toolbar} from '../global';
import {Button} from '../forms';
import {Close} from '../icons';
import CheckResponsePaginate from './CheckResponsePaginate';

const CheckEvent = React.createClass({
  propTypes: {
    params: PropTypes.object,
    location: PropTypes.shape({
      query: PropTypes.shape({
        json: PropTypes.string.isRequired
      })
    }),
    actions: PropTypes.shape({
      getCheckFromURI: PropTypes.func.isRequired
    }),
    redux: PropTypes.shape({
      checks: PropTypes.object
    })
  },
  componentWillMount() {
    // The JSON containing check notification data to populate the screenshot is
    // uploaded to S3 by the Notificaption service (but any JSON URL would work)
    const jsonURI = this.props.location.query.json;
    this.props.actions.getCheckFromURI(jsonURI);
  },
  getNotification() {
    const notification = this.props.redux.checks.notification;
    const hasData = !!notification && !notification.isEmpty();
    return hasData ? notification : new Map({ check_id: this.props.params.id });
  },
  getFailingResponses() {
    const notification = this.getNotification();
    return notification.get('responses').filter(response => !response.passing);
  },
  getTitle(){
    const name = this.getNotification().get('check_name') || this.getNotification().get('check_id') || '';
    const bool = this.getNotification().get('passing') ? 'Passing' : 'Failure';
    return `${bool} Event: ${name}`;
  },
  isJSONLoaded() {
    // True if the JSON has been loaded from the S3 URL
    return this.getNotification().get('check_name');
  },
  renderLink(){
    if (this.getNotification() && this.getNotification().get('check_id')){
      return (
        <Button to={`/check/${this.props.params.id}`} color="info" fab title={`Go to ${this.getNotification().get('check_name')}`}>
          <Close btn/>
        </Button>
      );
    }
    return null;
  },
  renderText(){
    const stamp = this.getNotification().get('timestamp');
    if (typeof stamp !== 'object'){
      return null;
    }
    const d = new Date(stamp.get('seconds') * 1000);
    const bool = this.getNotification().get('passing');
    return (
      <p>Your check began to {bool ? 'pass' : 'fail'} <TimeAgo date={d}/>. The responses are noted below for historical record. These responses are <strong>not</strong> live. To view the most current status of your check, click above.</p>
    );
  },
  renderInner() {
    if (!this.isJSONLoaded()) {
      return null;
    }
    return (
      <div className="js-screenshot-results">
        <Padding tb={1}>
          {this.renderText()}
          <CheckResponsePaginate responses={this.getNotification().get('responses')}
            allowCollapse={false} showRerunButton={false} />
        </Padding>
      </div>
    );
  },
  render() {
    let bg;
    if (this.isJSONLoaded()){
      bg = this.getNotification().get('passing') ? 'success' : 'danger';
    }
    return (
      <div>
        <Toolbar title={this.getTitle()} bg={bg}>
          {this.renderLink()}
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

export default connect(null, mapDispatchToProps)(CheckEvent);
