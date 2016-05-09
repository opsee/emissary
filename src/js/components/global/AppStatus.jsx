import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import StatusHandler from './StatusHandler';
import {Link} from 'react-router';
import _ from 'lodash';
import TimeAgo from 'react-timeago';

import {Alert} from '../layout';
import config from '../../modules/config';
import {user as userActions} from '../../actions';

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
  getData(){
    return this.props.redux.app.statusPageInfo.toJS();
  },
  getComponents(){
    return _.chain(this.getData())
    .get('components')
    .thru(arr => arr || [])
    .filter(component => {
      return typeof _.get(component, 'status') === 'string' && component.status !== 'operational';
    })
    .value();
  },
  getIncidents(){
    return _.chain(this.getData())
    .get('incidents')
    .thru(arr => arr || [])
    .value();
  },
  getMaints(){
    return _.chain(this.getData())
    .get('scheduled_maintenances')
    .thru(arr => arr || [])
    .value();
  },
  runDismissHelperText(){
    this.props.userActions.putData('hasDismissedCheckAssertionsHelp');
  },
  renderComponents(components){
    return (
      <div>
        hi
      </div>
    );
  },
  renderIncidents(incidents){
    return (
      <Alert color="danger" onDismiss={}>
        <ul style={{margin: 0}}>
          {incidents.map(item => {
            const date = new Date(Date.parse(item.created_at));
            return (
              <li key={item.id}>
                {_.capitalize(item.impact)}&nbsp;Incident: {item.name} 
              </li>
            )
          })}
        </ul>
      </Alert>
    );
  },
  render() {
    const incidents = this.getIncidents();
    const components = this.getComponents();
    if (incidents.length){
      return this.renderIncidents(incidents);
    } else if (components.length){
      return this.renderComponents(components);
    }
    return (
      <div>
        {JSON.stringify(this.getData())}
      </div>
    )
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps)(AppStatus);