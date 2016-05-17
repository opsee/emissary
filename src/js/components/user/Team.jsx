import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import {Table, Toolbar} from '../global';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import {Edit, Logout} from '../icons';
import {Heading} from '../type';
import {flag} from '../../modules';
import {
  user as actions,
  app as appActions,
  integrations as integrationsActions
} from '../../actions';
import {SlackInfo, PagerdutyInfo} from '../integrations';

const Profile = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      logout: PropTypes.func
    }),
    appActions: PropTypes.shape({
      shutdown: PropTypes.func
    }),
    redux: PropTypes.shape({
      user: PropTypes.object
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object
    }),
    integrationsActions: PropTypes.shape({
      getSlackInfo: PropTypes.func,
      getSlackChannels: PropTypes.func,
      getPagerdutyInfo: PropTypes.func
    })
  },
  componentWillMount() {
    if (!this.props.location.query.slack && flag('integrations-slack')){
      this.props.integrationsActions.getSlackInfo();
    }
    if (!this.props.location.query.pagerduty && flag('integrations-pagerduty')){
      this.props.integrationsActions.getPagerdutyInfo();
    }
  },
  handleLogout(){
    this.props.actions.logout();
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
    return (
       <div>
        <Toolbar title="TEAM NAME" pageTitle="Team">
          <Button fab color="info" to="/team/edit" title="Edit Your Team">
            <Edit btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={1}>
                <Heading level={3}>Your Team</Heading>
                <Table>
                  <tr>
                    <td><strong>Subscription Plan</strong></td>
                    <td>Free</td>
                  </tr>
                  <tr>
                    <td><strong>Plan Features</strong></td>
                    <td>1 Bastion, 1 User, Unlimited Checks</td>
                  </tr>
                  {this.renderSlackArea()}
                  {this.renderPagerdutyArea()}
                </Table>
              </Padding>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  appActions: bindActionCreators(appActions, dispatch),
  integrationsActions: bindActionCreators(integrationsActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Profile);