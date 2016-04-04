import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import {Table, Toolbar} from '../global';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Edit, Logout} from '../icons';
import {Padding} from '../layout';
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
          <td><SlackInfo/></td>
        </tr>
      );
    }
    return null;
  },
  renderPagerdutyArea(){
    if (flag('integrations-pagerduty')){
      return (
        <tr>
          <td><strong>Pagerduty</strong></td>
          <td><PagerdutyInfo/></td>
        </tr>
      );
    }
    return null;
  },
  render() {
    const user = this.props.redux.user.toJS();
    return (
       <div>
        <Toolbar title={user.name} pageTitle="Profile">
          <Button fab color="info" to="/profile/edit" title="Edit Your Profile">
            <Edit btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={1}>
                <Heading level={3}>Your Profile Information</Heading>
                <Table>
                  <tr>
                    <td><strong>Email</strong></td>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Password</strong></td>
                    <td><Link to="/profile/edit" >Change Your Password</Link></td>
                  </tr>
                  {this.renderSlackArea()}
                  {this.renderPagerdutyArea()}
                </Table>
              </Padding>
              <Padding t={3}>
                <Button flat color="danger" onClick={this.handleLogout}>
                  <Logout inline fill="danger"/> Log Out
                </Button>
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