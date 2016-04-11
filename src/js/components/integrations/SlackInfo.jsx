import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {integrations as actions} from '../../actions';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import SlackConnect from './SlackConnect';
import {Color} from '../type';
import {Alert} from '../layout';

/*eslint-disable camelcase*/
const redirect_uri = `${window.location.origin}/profile?slack=true`;
/*eslint-enable camelcase*/

const SlackInfo = React.createClass({
  propTypes: {
    data: PropTypes.shape({
      slackInfo: PropTypes.object
    }),
    user: PropTypes.object,
    query: PropTypes.object,
    actions: PropTypes.shape({
      slackAccess: PropTypes.func,
      getSlackInfo: PropTypes.func
    }).isRequired,
    connect: PropTypes.bool,
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        integrationsSlackAccess: PropTypes.object
      })
    }).isRequired
  },
  componentWillMount(){
    const {code} = this.props.query;
    if (code){
      return this.props.actions.slackAccess({
        code,
        /*eslint-disable camelcase*/
        redirect_uri
        /*eslint-enable camelcase*/
      });
    }
    return this.props.actions.getSlackInfo();
  },
  render() {
    const {asyncActions} = this.props.redux;
    const {status} = asyncActions.integrationsSlackAccess;
    /*eslint-disable camelcase*/
    const {team_name} = this.props.data.slackInfo;
    let nullArr = [];
    nullArr.push(this.props.query.code && !asyncActions.integrationsSlackAccess.history.length);
    nullArr.push(!this.props.query.code && !asyncActions.integrationsSlackInfo.history.length);
    if (status === 'pending' || (status === 'success' && !asyncActions.integrationsSlackInfo.history.length)) {
      return <span>Connecting...</span>;
    } else if (_.some(nullArr)){
      return null;
    } else if (status && status !== 'success'){
      return <Alert color="danger">Something went wrong trying to connect.</Alert>;
    } else if (team_name){
      return (
        <span>Team <Color c="success">{team_name}</Color>&nbsp;connected. <a href={`https://${team_name}.slack.com/apps/manage/A04MVPTFN-opsee`} target="_blank">Edit or remove integration</a></span>
      );
    }
    if (this.props.connect){
      return (
        <SlackConnect redirect={redirect_uri}/>
      );
    }
    return null;
  }
  /*eslint-enable camelcase*/
});

const mapStateToProps = (state) => ({
  redux: state,
  data: state.integrations,
  query: state.router.location.query
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SlackInfo);