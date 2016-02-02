import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {integrations as actions} from '../../actions';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import SlackConnect from './SlackConnect';
import {Color} from '../type';

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
      slackAccess: PropTypes.func
    }),
    redux: PropTypes.shape({
      asyncActions: PropTypes.shape({
        integrationsSlackAccess: PropTypes.object
      })
    })
  },
  componentWillMount(){
    const {code} = this.props.query;
    if (code){
      this.props.actions.slackAccess({
        code,
        /*eslint-disable camelcase*/
        redirect_uri
        /*eslint-enable camelcase*/
      });
    }
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
      return <span>Something went wrong.</span>;
    } else if (team_name){
      return (
        <span>Team <Color c="success">{team_name}</Color> is connected to <a href={`https://${team_name}.slack.com/apps/manage/A04MVPTFN-opsee`} target="_blank">Opsee</a></span>
      );
    }
    return (
      <SlackConnect redirect={redirect_uri}/>
    );
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