import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Toolbar} from '../global';
import {Col, Grid, Panel, Row} from '../layout';
import {
  team as actions
} from '../../actions';

const Profile = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getTeam: PropTypes.func
    }),
    userActions: PropTypes.shape({
      logout: PropTypes.func.isRequired
    }).isRequired,
    onboardActions: PropTypes.shape({
      getDefaultNotifications: PropTypes.func.isRequired
    }).isRequired,
    redux: PropTypes.shape({
      team: PropTypes.object.isRequired,
      user: PropTypes.object.isRequired,
      asyncActions: PropTypes.shape({
        teamGet: PropTypes.object,
        onboardGetDefaultNotifs: PropTypes.object.isRequired
      }).isRequired,
      env: PropTypes.shape({
        activeBastion: PropTypes.object
      }),
      onboard: PropTypes.shape({
        defaultNotifs: PropTypes.array
      })
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  },
  componentWillMount() {
    this.props.actions.getTeam();
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.redux.asyncActions.teamGet.status === 'success'){
      if (nextProps.redux.team.users.size > 1){
        return this.props.history.push('/team/edit');
      }
      return this.props.history.push('/profile/edit');
    }
    return true;
  },
  render() {
    return (
      <div>
        <Toolbar title="Billing"/>
        <Grid>
          <Row>
            <Col xs={12}>
              <Panel>
                Redirecting...
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

export default connect(null, mapDispatchToProps)(Profile);