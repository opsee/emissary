import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {integrations as actions} from '../../actions';
import {bindActionCreators} from 'redux';

import SlackConnect from './SlackConnect';

/*eslint-disable camelcase*/
const redirect_uri = `${window.location.origin}/profile?slack=true`;
/*eslint-enable camelcase*/

const SlackInfo = React.createClass({
  propTypes: {
    user: PropTypes.object,
    query: PropTypes.object,
    actions: PropTypes.shape({
      slackAccess: PropTypes.func
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
    if (this.props.user.get('token1')){
      return (
        <span>Connected to <a href="https://opsee.com">Opsee</a></span>
      );
    }
    return (
      /*eslint-disable camelcase*/
      <SlackConnect redirect={redirect_uri}/>
      /*eslint-enable camelcase*/
    );
  }
});

const mapStateToProps = (state) => ({
  user: state.user,
  query: state.router.location.query
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SlackInfo);