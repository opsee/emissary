import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Map} from 'immutable';
import TimeAgo from 'react-timeago';
import {Link} from 'react-router';
import _ from 'lodash';

import {checks as actions} from '../../actions';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import {Toolbar} from '../global';
import CheckResponsePaginate from './CheckResponsePaginate';
import {InstanceItem, GroupItem} from '../env';
import {Heading} from '../type';

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
    const name = this.getNotification().get('check_name') || '';
    if (!name){
      return '';
    }
    const bool = this.getNotification().get('passing') ? 'Passing' : 'Failure';
    return `${bool} Event: ${name}`;
  },
  isJSONLoaded() {
    // True if the JSON has been loaded from the S3 URL
    return this.getNotification().get('check_name');
  },
  renderText(){
    let stamp = this.getNotification().get('timestamp');
    if (typeof stamp === 'number'){
      stamp = new Date(stamp);
    }
    if (typeof stamp !== 'object'){
      return null;
    }
    const bool = this.getNotification().get('passing');
    return (
      <p>Your check began to {bool ? 'pass' : 'fail'} <TimeAgo date={stamp}/>. The responses are noted below for historical record. These responses are <strong>not</strong> live. <br/>
        To view the most current status of your check, <Link to={`/check/${this.props.params.id}`}>click here</Link>.</p>
    );
  },
  renderTarget(notif){
    const target = _.get(notif.toJS(), 'target') || {};
    if (target && (target.type === 'host' || target.type === 'external_host')){
      return null;
    }
    let el;
    switch (target.type){
    case 'instance':
      el = <InstanceItem target={target}/>;
      break;
    default:
      el = <GroupItem target={target}/>;
      break;
    }
    return (
      <Padding b={1}>
        <Heading level={3}>Target</Heading>
        {el}
      </Padding>
    );
  },
  renderInner() {
    const notif = this.getNotification();
    if (!this.isJSONLoaded()) {
      return null;
    }
    let d = notif.get('timestamp');
    if (typeof d === 'number'){
      d = new Date(d);
    } else if (typeof d === 'object' && d.toJS){
      d = new Date(d.get('seconds') * 1000);
    }
    return (
      <div className="js-screenshot-results">
        <Padding tb={1}>
          {this.renderText()}
          {this.renderTarget(notif)}
          <CheckResponsePaginate responses={notif.get('responses')}
            allowCollapse={false} showRerunButton={false} date={d}/>
            <Padding t={2}>
              <Button href={this.props.location.query.json} target="_blank" flat color="default">View Raw Event JSON</Button>
            </Padding>
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
        <Toolbar title={this.getTitle()} bg={bg}/>
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
