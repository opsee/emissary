import React, {PropTypes} from 'react';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import {Table, Toolbar} from '../global';
import {Link} from 'react-router';
import UserInputs from '../user/UserInputs.jsx';
import _ from 'lodash';
import router from '../../modules/router.js';
import {PageAuth} from '../../modules/statics';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Edit, Logout} from '../icons';

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
    })
  },
  getInitialState(){
    return {
      user: UserStore.getUser().toJS()
    }
  },
  logOut(){
    return UserActions.userLogOut();
  },
  render() {
    return (
       <div>
        <Toolbar title={this.state.user.name}>
          <Button fab color="primary" to="profileEdit" title="Edit Your Profile">
            <Edit btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <div className="padding-b">
                <h3>Your Profile Information</h3>
                <Table>
                  <tr>
                    <td><strong>Email</strong></td>
                    <td>{this.state.user.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Name</strong></td>
                    <td>{this.state.user.name}</td>
                  </tr>
                </Table>
              </div>
              <div className="padding-b">
                <Button flat noPad color="primary" to="profileEdit" >Change Your Password</Button>
              </div>
              <div className="btn-container btn-container-righty">
                <Button flat noPad color="danger" onClick={this.logOut}>
                  <Logout inline fill="danger"/> Log Out
                </Button>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
