import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import TimeAgo from 'react-timeago';
import _ from 'lodash';

import {Table, Toolbar} from '../global';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import {Add, Edit} from '../icons';
import {Color, Heading} from '../type';
import {flag} from '../../modules';
import {toSentenceSerial} from '../../modules/string';
import {
  team as actions
} from '../../actions';
import {SlackInfo, PagerdutyInfo} from '../integrations';

const Profile = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getTeam: PropTypes.func
    }),
    redux: PropTypes.shape({
      team: PropTypes.object
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object
    })
  },
  componentWillMount() {
    this.props.actions.getTeam();
  },
  getTeamData(){
    return this.props.redux.team.toJS();
  },
  renderSlackArea(){
    if (flag('integrations-slack')){
      return (
        <tr>
          <td><strong>Slack</strong></td>
          <td><SlackInfo connect/></td>
        </tr>
      );
    }
    return null;
  },
  renderPagerdutyArea(){
    if (flag('integrations-pagerduty')){
      return (
        <tr>
          <td><strong>PagerDuty</strong></td>
          <td><PagerdutyInfo/></td>
        </tr>
      );
    }
    return null;
  },
  render() {
    const team = this.getTeamData();
    if (team.name){
      return (
         <div>
          <Toolbar title={`Team ${team.name}`} pageTitle="Team">
            <Button fab color="info" to="/team/edit" title="Edit Your Team">
              <Edit btn/>
            </Button>
          </Toolbar>
          <Grid>
            <Row>
              <Col xs={12}>
                <Heading level={3}>Team Details</Heading>
                <Table>
                  {window.location.href.match('localhost|staging') && (
                    <tr>
                      <td><strong>Subscription Plan</strong></td>
                      <td>{team.plan}</td>
                    </tr>
                  )}
                  {window.location.href.match('localhost|staging') && (
                    <tr>
                      <td><strong>Plan Features</strong></td>
                      <td>{toSentenceSerial(team.features)}</td>
                    </tr>
                  )}
                  {this.renderSlackArea()}
                  {this.renderPagerdutyArea()}
                </Table>
                <Padding t={3}>
                  <Heading level={3}>Team Members</Heading>
                  <Table>
                    {team.members.map(member => {
                      return (
                        <tr>
                          <td>
                            <Link to={`/team/member/${member.id}`}>{member.name || member.email}</Link><br/>{toSentenceSerial(member.capabilities.map(_.capitalize))}
                          </td>
                          <td style={{textAlign: 'right'}}>
                            <Color c={_.get({active: 'success', invited: 'warning'}, member.status)}>{_.capitalize(member.status)}</Color>
                          </td>
                        </tr>
                      );
                    })}
                  </Table>
                  <Padding t={1}>
                    <Button to="/team/member/invite" color="primary" flat><Add inline fill="primary"/>Invite New Team Member</Button>
                  </Padding>
                </Padding>
                {window.location.href.match('localhost|staging') && (
                  <Padding t={3}>
                    <Heading level={3}>Billing</Heading>
                    <Padding b={1}>
                      MasterCard ****4040 4/2041&nbsp;&nbsp;&nbsp;<Link to="/team/edit">Edit</Link>
                    </Padding>
                    <Table>
                      {_.sortBy(team.invoices, i => -1 * i.date).map(invoice => {
                        return (
                          <tr>
                            <td>
                              <strong>${invoice.amount.toFixed(2)}</strong> on {new Date(invoice.date).toDateString()}<br/>
                              <Color c="gray5"><small><TimeAgo date={invoice.date}/></small></Color>
                            </td>
                          </tr>
                        );
                      })}
                    </Table>
                  </Padding>
                )}
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

export default connect(null, mapDispatchToProps)(Profile);