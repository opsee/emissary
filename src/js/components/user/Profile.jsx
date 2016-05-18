import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';

import {Table, Toolbar} from '../global';
import {Col, Grid, Padding, Row} from '../layout';
import {Button} from '../forms';
import {Edit, Logout} from '../icons';
import {Heading} from '../type';
import {
  user as actions,
  app as appActions
} from '../../actions';

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
    })
  },
  handleLogout(){
    this.props.actions.logout();
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
                <Heading level={3}>Your Profile</Heading>
                <Table>
                  <tr>
                    <td><strong>Team</strong></td>
                    <td><Link to="/team">TEAM NAME</Link></td>
                  </tr>
                  <tr>
                    <td><strong>Email</strong></td>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Password</strong></td>
                    <td><Link to="/profile/edit" >Change Your Password</Link></td>
                  </tr>
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
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(null, mapDispatchToProps)(Profile);