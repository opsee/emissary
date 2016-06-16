import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {StatusHandler, Toolbar} from '../global';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import {Close} from '../icons';
import {Member} from '../../modules/schemas';
import {
  team as actions
} from '../../actions';
import TeamMemberInputs from './TeamMemberInputs';

const TeamMemberInvite = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getTeam: PropTypes.func.isRequired,
      memberInvite: PropTypes.func.isRequired
    }).isRequired,
    redux: PropTypes.shape({
      team: PropTypes.object,
      asyncActions: PropTypes.shape({
        teamMemberInvite: PropTypes.object
      }).isRequired
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object
    }),
    params: PropTypes.object.isRequired
  },
  getInitialState() {
    return new Member().toJS();
  },
  getStatus(){
    return this.props.redux.asyncActions.teamMemberInvite.status;
  },
  handleInputChange(state){
    this.setState(state);
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.actions.memberInvite(this.state, true);
  },
  render() {
    return (
       <div>
        <Toolbar title="Invite New Team Member" bg="info" btnPosition="midRight">
          <Button to="/team" icon flat>
            <Close btn/>
          </Button>
        </Toolbar>
        <form onSubmit={this.handleSubmit}>
          <Grid>
            <Row>
              <Col xs={12}>
                <TeamMemberInputs onChange={this.handleInputChange} perms={this.state.perms} email={this.state.email} inputs={['perms', 'email']}/>
              </Col>
              <StatusHandler status={this.getStatus()}/>
              <Col xs={12}>
                <Padding t={2}>
                  <Button color="success" block type="submit" disabled={!this.state.email || this.getStatus() === 'pending'}>Invite</Button>
                </Padding>
              </Col>
            </Row>
          </Grid>
        </form>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(TeamMemberInvite);