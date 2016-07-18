import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {StatusHandler, Toolbar} from '../global';
import {Col, Grid, Padding, Panel, Row} from '../layout';
import {Button} from '../forms';
import {Close} from '../icons';
import {Member} from '../../modules/schemas';
import {
  team as actions
} from '../../actions';
import TeamMemberInputs from './TeamMemberInputs';

const TeamMemberEdit = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getTeam: PropTypes.func,
      memberEdit: PropTypes.func
    }),
    redux: PropTypes.shape({
      team: PropTypes.object,
      asyncActions: PropTypes.shape({
        teamMemberEdit: PropTypes.object
      })
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object
    }),
    params: PropTypes.object.isRequired
  },
  componentWillMount() {
    this.props.actions.getTeam();
  },
  getInitialState() {
    return this.getData();
  },
  componentWillReceiveProps(nextProps) {
    const nextMember = this.getData(nextProps);
    const member = this.getData();
    if (nextMember.email !== member.email){
      this.setState(nextMember);
    }
  },
  getData(props = this.props){
    const team = props.redux.team.toJS();
    return _.chain(team)
    .get('users')
    .find({
      id: this.props.params.id
    })
    .value() || new Member().toJS();
  },
  getStatuses(){
    return [
      {
        id: 'active',
        label: 'Active: Normal operation'
      },
      {
        id: 'inactive',
        label: 'Inactive: Disable login and all user functions'
      }
    ];
  },
  handleInputChange(state){
    this.setState(state);
  },
  handleCapabilityClick(id){
    let arr = _.clone(this.state.perms);
    if (arr.indexOf(id) === -1){
      arr = arr.concat([id]);
    } else {
      arr = _.reject(arr, i => i === id);
    }
    this.setState({
      perms: arr
    });
  },
  handleSubmit(e){
    e.preventDefault();
    this.props.actions.memberEdit(this.state);
  },
  render() {
    const member = this.getData();
    const to = this.props.location.query.ref || `/team/member/${member.id}`;
    if (member.email){
      return (
         <div>
          <Toolbar title={`Edit Team Member: ${member.name || member.email}`} pageTitle="Team Member" bg="info" btnPosition="midRight">
            <Button to={to} icon flat>
              <Close btn/>
            </Button>
          </Toolbar>
          <form onSubmit={this.handleSubmit}>
            <Grid>
              <Row>
                <Col xs={12}>
                  <Padding t={1}>
                    <Panel>
                      <TeamMemberInputs onChange={this.handleInputChange} {...this.state}/>
                      <StatusHandler status={this.props.redux.asyncActions.teamMemberEdit.status}/>
                      <Padding t={2}>
                        <Button color="success" block type="submit">Update</Button>
                      </Padding>
                    </Panel>
                  </Padding>
                </Col>
              </Row>
            </Grid>
          </form>
        </div>
      );
    }
    return null;
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(TeamMemberEdit);