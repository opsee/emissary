import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import _ from 'lodash';

import {Table, Toolbar} from '../global';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import {Edit, Logout} from '../icons';
import {Color, Heading} from '../type';
import {flag} from '../../modules';
import {toSentenceSerial} from '../../modules/string';
import {
  team as actions
} from '../../actions';
import {SlackInfo, PagerdutyInfo} from '../integrations';

const TeamMember = React.createClass({
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
  getData(){
    const team = this.props.redux.team.toJS();
    return _.chain(team)
    .get('members')
    .find({
      id: this.props.params.id
    })
    .value() || {};
  },
  render() {
    const member = this.getData();
    if (member.email){
      return (
         <div>
          <Toolbar title={`Team Member: ${member.name || member.email}`} pageTitle="Team Member">
            <Button fab color="info" to={`/team/member/${member.id}/edit`} title={`Edit ${member.name}`}>
              <Edit btn/>
            </Button>
          </Toolbar>
          <Grid>
            <Row>
              <Col xs={12}>
                <Table>
                  <tr>
                    <td>Status</td>
                    <td><Color c={_.get({active: 'success', invited: 'warning'}, member.status)}>{_.capitalize(member.status)}</Color></td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{member.email}</td>
                  </tr>
                  {
                  // <tr>
                  //   <td>Password</td>
                  //   <td><Link to={`/team/member/${member.id}/edit`}>Change the password of {member.name}</Link></td>
                  // </tr>
                  }
                  {member.capabilities.length && (
                    <tr>
                      <td>Capabilities</td>
                      <td>{toSentenceSerial(member.capabilities.map(_.capitalize))}</td>
                    </tr>
                    ) || null}
                </Table>
                <Padding t={3}>
                  <Link to="/team">View your Team</Link>
                </Padding>
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }
    return null;
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(TeamMember);