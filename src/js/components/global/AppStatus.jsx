import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {is} from 'immutable';
import _ from 'lodash';
import TimeAgo from 'react-timeago';
import moment from 'moment';

import {Alert, Grid, Row, Col} from '../layout';
import {bindActionCreators} from 'redux';
import {user as userActions} from '../../actions';
import {UserDataRequirement} from '../user';
import {Heading} from '../type';

const AppStatus = React.createClass({
  propTypes: {
    children: PropTypes.node,
    redux: PropTypes.shape({
      app: PropTypes.shape({
        statusPageInfo: PropTypes.object.isRequired
      })
    }),
    userActions: PropTypes.shape({
      putData: PropTypes.func.isRequired
    })
  },
  shouldComponentUpdate(nextProps) {
    return !is(nextProps.redux.app.statusPageInfo, this.props.redux.app.statusPageInfo);
  },
  getData(){
    return this.props.redux.app.statusPageInfo.toJS();
  },
  getId(){
    const components = this.getComponents();
    const incidents = this.getIncidents();
    const maints = this.getMaints();
    if (incidents.length){
      return _.head(incidents).id;
    } else if (components.length){
      return `${_.head(components).name}-${_.head(components).created_at}`;
    } else if (maints.length){
      return _.head(maints).id;
    }
    //this technically shouldn't happen
    return 'appStatus';
  },
  getComponents(){
    return _.chain(this.getData())
    .get('components')
    .filter(component => {
      return typeof _.get(component, 'status') === 'string' && component.status !== 'operational';
    })
    .sortBy(c => {
      return -1 * Date.parse(c.created_at);
    })
    .value();
  },
  getIncidents(){
    return _.chain(this.getData())
    .get('incidents')
    .sortBy(c => {
      return -1 * Date.parse(c.created_at);
    })
    .value();
  },
  getMaints(){
    return _.chain(this.getData())
    .get('scheduled_maintenances')
    .sortBy(c => {
      return -1 * Date.parse(c.created_at);
    })
    .value();
  },
  runDismiss(){
    this.props.userActions.putData(`hasDismissedAppStatus-${this.getId()}`);
  },
  renderComponents(components){
    return (
      <ul style={{margin: 0}}>
        {components.map(item => {
          const date = new Date(Date.parse(item.updated_at));
          const status = _.chain((item.status || '')).split('_').map(_.capitalize).join(' ').value();
          return (
            <li key={item.id}>
              <TimeAgo date={date}/>&nbsp;{status}: {item.name}
            </li>
          );
        })}
      </ul>
    );
  },
  renderIncidents(incidents){
    return (
      <ul style={{margin: 0}}>
        {incidents.map(item => {
          const date = new Date(Date.parse(item.created_at));
          return (
            <li key={item.id}>
              {_.capitalize(item.impact)}&nbsp;Incident created <TimeAgo date={date}/>: {item.name}
            </li>
          );
        })}
      </ul>
    );
  },
  renderMaints(maints){
    return (
      <ul style={{margin: 0}}>
        {maints.map(item => {
          const scheduledFor = new Date(Date.parse(item.scheduled_for));
          const scheduledUntil = new Date(Date.parse(item.scheduled_until));
          const diff = moment(scheduledUntil).diff(scheduledFor, 'minutes');
          return (
            <li key={item.id}>
              {item.name} (maintenance) scheduled for {diff} minutes starting <TimeAgo date={scheduledFor}/>
            </li>
          );
        })}
      </ul>
    );
  },
  render() {
    const incidents = this.getIncidents();
    const components = this.getComponents();
    const maints = this.getMaints();
    let el = null;
    if (incidents.length){
      el = this.renderIncidents(incidents);
    } else if (components.length){
      el = this.renderComponents(components);
    } else if (maints.length){
      el = this.renderMaints(maints);
    }
    if (!el){
      return null;
    }
    return (
      <UserDataRequirement hideIf={`hasDismissedAppStatus-${this.getId()}`}>
        <Alert color="danger" onDismiss={this.runDismiss}>
          <Grid>
            <Row>
              <Col xs={12}>
                <Heading level={3}><a href="http://status.opsee.com/" target="_blank">Opsee Status</a></Heading>
                {el}
              </Col>
            </Row>
          </Grid>
        </Alert>
      </UserDataRequirement>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(userActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AppStatus);