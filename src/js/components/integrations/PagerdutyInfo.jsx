import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {integrations as actions, app as appActions} from '../../actions';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Color} from '../type';
import PagerdutyConnect from './PagerdutyConnect';
import {StatusHandler} from '../global';

const PagerdutyInfo = React.createClass({
  propTypes: {
    data: PropTypes.shape({
      pagerdutyInfo: PropTypes.object
    }),
    user: PropTypes.object,
    query: PropTypes.object,
    actions: PropTypes.shape({
      pagerdutyAccess: PropTypes.func,
      getPagerdutyInfo: PropTypes.func
    }).isRequired,
    appActions: PropTypes.shape({
      confirmOpen: PropTypes.func
    }),
    connect: PropTypes.bool,
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        integrationsPagerdutyAccess: PropTypes.object,
        integrationsPagerdutyDisconnect: PropTypes.object
      })
    }).isRequired
  },
  componentWillMount(){
    if (this.props.query.pagerduty && !this.props.query.error){
      this.props.actions.pagerdutyAccess(_.assign(this.props.query, {
        enabled: true
      }));
    }
  },
  handleDisablePagerduty(){
    this.props.appActions.confirmOpen({
      html: '<p>Are you sure you no longer want to receive PagerDuty notifications?</p>',
      confirmText: 'Yes, disconnect',
      color: 'danger',
      onConfirm: this.props.actions.pagerdutyAccess.bind(null, _.assign(this.props.data.pagerdutyInfo, {
        enabled: false
      }))
    });
  },
  render() {
    const serviceName = _.get(this.props.data.pagerdutyInfo, 'service_name');
    const {enabled} = this.props.data.pagerdutyInfo;
    const {asyncActions} = this.props.redux;
    if (this.props.query.pagerduty && !this.props.query.error){
      if (asyncActions.integrationsPagerdutyInfo.status === 'success'){
        if (serviceName && enabled) {
          return (
            <span>
              Service <Color c="success">{serviceName}</Color>&nbsp;connected.&nbsp;
              <a onClick={this.handleDisablePagerduty} href="#">Disconnect</a>
            </span>
           );
        }
      }
      return (
        <StatusHandler status={asyncActions.integrationsPagerdutyAccess.status}>
          PagerDuty connection successful.
        </StatusHandler>
      );
    }
    if (serviceName && enabled) {
      return (
        <span>
          Service <Color c="success">{serviceName}</Color>&nbsp;connected.&nbsp;
          <a onClick={this.handleDisablePagerduty} href="#">Disconnect</a>
        </span>
      );
    }
    return (
      <PagerdutyConnect redirect={`${window.location.origin}/profile?pagerduty=true`}/>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state,
  data: state.integrations,
  query: state.router.location.query
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PagerdutyInfo);