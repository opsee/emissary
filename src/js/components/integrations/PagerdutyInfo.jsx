import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {integrations as actions} from '../../actions';
import {bindActionCreators} from 'redux';

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
    connect: PropTypes.bool,
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        integrationsPagerdutyAccess: PropTypes.object,
        integrationsPagerdutyDisconnect: PropTypes.object
      })
    }).isRequired
  },
  componentWillMount(){
    if (this.props.query.pagerduty){
      let q = this.props.query;
      q.enabled = true;
      this.props.actions.pagerdutyAccess(q);
    }
  },
  handleDisablePagerduty(){
    let q = this.props.data.pagerdutyInfo;
    q.enabled = false;
    this.props.actions.pagerdutyAccess(q);
  },
  render() {
    const {service_name} = this.props.data.pagerdutyInfo;
    const {enabled} = this.props.data.pagerdutyInfo;
    const {asyncActions} = this.props.redux;
    if (this.props.query.pagerduty){
      if (asyncActions.integrationsPagerdutyInfo.status === 'success'){
        /*eslint-disable camelcase*/
        if (service_name && enabled) {
          return (
            <span>
              Service <Color c="success">{service_name}</Color>&nbsp;connected.&nbsp;
              <a onClick={this.handleDisablePagerduty} href="#">Disconnect</a>
            </span>
           );
        }
        /*eslint-enable camelcase*/
      }
      return (
        <StatusHandler status={asyncActions.integrationsPagerdutyAccess.status}>
          PagerDuty connection successful.
        </StatusHandler>
      );
    }
    /*eslint-disable camelcase*/
    if (service_name && enabled) {
      return (
        <span>
          Service <Color c="success">{service_name}</Color>&nbsp;connected.&nbsp;
          <a onClick={this.handleDisablePagerduty} href="#">Disconnect</a>
        </span>
      );
    }
    /*eslint-enable camelcase*/
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
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PagerdutyInfo);
