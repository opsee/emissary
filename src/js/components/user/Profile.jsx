import React from 'react';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import {Table, Toolbar} from '../global';
import router from '../../modules/router.js';
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
          <Button fab color="primary" to="profileEdit" title="Edit Your Profile">
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
                    <td><strong>Name</strong></td>
                    <td>{this.state.user.name}</td>
                  </tr>
                </Table>
              </Padding>
              <Padding b={1}>
                <Button flat noPad color="primary" to="profileEdit" >Change Your Password</Button>
              </Padding>
              <div className="btn-container btn-container-righty">
                <Button flat noPad color="danger" onClick={this.runLogOut}>
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
