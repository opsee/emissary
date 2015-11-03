import React from 'react';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import {Table, Toolbar} from '../global';
import router from '../../modules/router.js';
import {Link} from 'react-router';
import {PageAuth} from '../../modules/statics';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Edit, Logout} from '../icons';
import {Padding} from '../layout';

export default React.createClass({
  mixins: [UserStore.mixin],
  statics: {
    willTransitionTo: PageAuth
  },
  storeDidChange(){
    if (!UserStore.getAuth()){
      return router.transitionTo('login');
    }
    this.setState({
      user: UserStore.getUser().toJS()
    });
  },
  getInitialState(){
    return {
      user: UserStore.getUser().toJS()
    };
  },
  runLogOut(){
    return UserActions.userLogOut();
  },
  render() {
    return (
       <div>
        <Toolbar title={this.state.user.name}>
          <Button fab color="info" to="profileEdit" title="Edit Your Profile">
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
                    <td><Link to="profileEdit" >Change Your Password</Link></td>
                  </tr>
                </Table>
              </Padding>
              <Padding t={3}>
                <Button flat color="danger" onClick={this.runLogOut}>
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
