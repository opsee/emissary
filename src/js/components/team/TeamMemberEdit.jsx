import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import _ from 'lodash';

import {Table, Toolbar} from '../global';
import {Col, Grid, Padding, Row} from '../layout';
import {Button, Input, RadioSelect} from '../forms';
import {Close} from '../icons';
import {Color, Heading} from '../type';
import {flag} from '../../modules';
import {toSentenceSerial} from '../../modules/string';
import {
  team as actions
} from '../../actions';
import {SlackInfo, PagerdutyInfo} from '../integrations';
import TeamMemberInputs from './TeamMemberInputs';

const TeamMemberEdit = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getTeam: PropTypes.func
    }),
    redux: PropTypes.shape({
      team: PropTypes.object
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
    if (nextMember.name !== member.name){
      this.setState(nextMember);
    }
  },
  getData(props = this.props){
    const team = props.redux.team.toJS();
    return _.chain(team)
    .get('members')
    .find({
      id: this.props.params.id
    })
    .value() || {};
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
    let arr = _.clone(this.state.capabilities);
    if (arr.indexOf(id) === -1){
      arr = arr.concat([id]);
    } else {
      arr = _.reject(arr, i => i === id);
    }
    this.setState({
      capabilities: arr
    });
  },
  handleSubmit(e){
    e.preventDefault();
    console.log(this.state);
  },
  render() {
    const member = this.getData();
    if (member.name){
      return (
         <div>
          <Toolbar title={`Edit Team Member: ${member.name}`} pageTitle="Team Member" bg="info" btnPosition="midRight">
            <Button to={`/team/member/${member.id}`} icon flat>
              <Close btn/>
            </Button>
          </Toolbar>
          <form onSubmit={this.handleSubmit}>
            <Grid>
              <Row>
                <Col xs={12}>
                  <TeamMemberInputs onChange={this.handleInputChange} {...this.state}/>
                  <Padding t={2}>
                    <Button color="success" block type="submit">Update</Button>
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