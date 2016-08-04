import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Map} from 'immutable';
import TimeAgo from 'react-timeago';
import {Link} from 'react-router';
import _ from 'lodash';

import {checks as actions} from '../../actions';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {Button} from '../forms';
import {StatusHandler, Toolbar} from '../global';
import {Close} from '../icons';
import CheckResponsePaginate from './CheckResponsePaginate';
import {InstanceItem, GroupItem} from '../env';
import {Heading} from '../type';
import ViewHTTP from './ViewHTTP';
import ViewCloudwatch from './ViewCloudwatch';

const CheckEvent = React.createClass({
  propTypes: {
    params: PropTypes.object,
    location: PropTypes.shape({
      query: PropTypes.shape({
        json: PropTypes.string
      })
    }),
    actions: PropTypes.shape({
      getCheckFromURI: PropTypes.func.isRequired,
      getCheck: PropTypes.func.isRequired
    }).isRequired,
    redux: PropTypes.shape({
      checks: PropTypes.object,
      asyncActions: PropTypes.shape({
        getCheck: PropTypes.object
      })
    }),
    s3: PropTypes.bool
  },
  getInitialState() {
    return {
      s3: !!this.props.location.query.json
    };
  },
  componentWillMount() {
    // The JSON containing check notification data to populate the screenshot is
    // uploaded to S3 by the Notificaption service (but any JSON URL would work)
    if (this.state.s3){
      this.props.actions.getCheckFromURI(this.props.location.query.json);
    }
    this.props.actions.getCheck(this.props.params.id, this.props.params.state_transition_id);
  },
  getData() {
    if (this.state.s3){
      const notification = this.props.redux.checks.notification;
      const hasData = !!notification && !notification.isEmpty();
      return hasData ? notification : new Map({ check_id: this.props.params.id });
    }
    return this.props.redux.checks.single;
  },
  getFailingResponses(check) {
    return check.get('responses').filter(response => !response.passing);
  },
  getTitle(check){
    const name = check.get('name') || '';
    if (!name){
      return 'Check Event';
    }
    const bool = check.get('passing') ? 'Passing' : 'Failure';
    return `${bool} Event: ${name}`;
  },
  renderText(check){
    const c = check.toJS();
    const bool = !!c.passing;
    if (c.name){
      let stamp = c.timestamp;
      if (!stamp){
        stamp = _.chain(c)
        .get('state_transitions')
        .find({id: parseInt(this.props.params.state_transition_id, 10)})
        .get('occurred_at')
        .value();
        if (!stamp){
          stamp = _.chain(c)
          .get('results')
          .map('timestamp')
          .head()
          .value();
        }
      }
      if (typeof stamp === 'number'){
        stamp = new Date(stamp);
      }
      if (typeof stamp !== 'object'){
        return null;
      }
      return (
        <p>Your check began to {bool ? 'pass' : 'fail'} <TimeAgo date={stamp}/>. The responses are noted below for historical record. These responses are <strong>not</strong> live. <br/>
          To view the most current status of your check, <Link to={`/check/${this.props.params.id}`}>click here</Link>.</p>
      );
    }
    return null;
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
  renderViewJSON(){
    if (this.state.s3){
      return (
        <Padding t={2}>
          <Button href={this.props.location.query.json} target="_blank" flat color="default">View Raw Event JSON</Button>
        </Padding>
      );
    }
    return null;
  },
  renderInner(check) {
    if (this.state.s3){
      if (!check.get('name')) {
        return null;
      }
      let d = check.get('timestamp');
      if (typeof d === 'number'){
        d = new Date(d);
      } else if (typeof d === 'object' && d.toJS){
        d = new Date(d.get('seconds') * 1000);
      }
      return (
        <div className="js-screenshot-results">
          <Padding tb={1}>
            {this.renderTarget(check)}
            <CheckResponsePaginate responses={check.get('responses')}
              allowCollapse={false} showRerunButton={false} date={d}/>
              {this.renderViewJSON(check)}
          </Padding>
        </div>
      );
    }
    return this.renderView(check);
  },
  renderView(check){
    if (check.get('tags').find(() => 'complete')){
      const isCloudwatch = _.chain(check.toJS()).get('assertions').head().get('key').value() === 'cloudwatch';
      if (isCloudwatch){
        return (
          <ViewCloudwatch check={check}/>
        );
      }
      return (
        <ViewHTTP check={check} redux={this.props.redux} sections={['assertions', 'responses', 'notifications']} historical/>
      );
    }
    return (
      <StatusHandler status={this.props.redux.asyncActions.getCheck.status} errorText="Could not load check event. This could be that your check event is too old. Events beyond a certain date are not supported."/>
    );
  },
  render() {
    const check = this.getData();
    let bg;
    if (check.get('name')){
      bg = check.get('passing') ? 'success' : 'danger';
    }
    return (
      <div>
        <Toolbar title={this.getTitle(check)} bg={bg} btnPosition="midRight">
          <Button to={`/check/${this.props.params.id}`} icon flat title="Return to Check">
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid style={{minHeight: '400px'}}>
          <Row>
            <Col xs={12}>
              <Panel>
                {this.renderText(check)}
                {this.renderInner(check)}
              </Panel>
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