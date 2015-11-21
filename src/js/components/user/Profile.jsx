import React from 'react';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import {Table, Toolbar} from '../global';
import {Link, History} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Edit, Logout} from '../icons';
import {Padding} from '../layout';

export default React.createClass({
  mixins: [UserStore.mixin, History],
  storeDidChange(){
    this.setState({
      user: UserStore.getUser().toJS()
    });
  },
  getInitialState(){
    return {
      user: UserStore.getUser().toJS()
    };
  },
  runLogout(){
    this.history.pushState(null, '/login');
    UserActions.userLogOut();
  },
  render() {
    return (
       <div>
        <Toolbar title={this.state.user.name} pageTitle="Profile">
          <Button fab color="info" to="/profile/edit" title="Edit Your Profile">
            <Edit btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <Padding b={1}>
                <h3>Your Profile Information</h3>
                <Table>
                  <tr>
                    <td><strong>Email</strong></td>
                    <td>{this.state.user.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Password</strong></td>
                    <td><Link to="/profile/edit" >Change Your Password</Link></td>
                  </tr>
                </Table>
              </Padding>
              <Padding t={3}>
                <Button flat color="danger" onClick={this.runLogout}>
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
