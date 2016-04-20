import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {integrations as actions} from '../../actions';
import {bindActionCreators} from 'redux';

import PagerdutyConnect from './PagerdutyConnect';
import {StatusHandler} from '../global';

const PagerdutyInfo = React.createClass({
  propTypes: {
    data: PropTypes.shape({
      slackInfo: PropTypes.object
    }),
    user: PropTypes.object,
    query: PropTypes.object,
    actions: PropTypes.shape({
      pagerdutyAccess: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        integrationsPagerdutyAccess: PropTypes.object
      })
    })
  },
  componentWillMount(){
    if (this.props.query.pagerduty){
      this.props.actions.pagerdutyAccess(this.props.query);
    }
  },
  render() {
    const {asyncActions} = this.props.redux;
    if (this.props.query.pagerduty){
      return (
        <StatusHandler status={asyncActions.integrationsPagerdutyAccess.status}>
          Pagerduty connection successful.
        </StatusHandler>
      );
    } else if (asyncActions.integrationsPagerdutyInfo.status === 'success'){
      return (
        <div>
          Pagerduty info here.
        </div>
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
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PagerdutyInfo);
