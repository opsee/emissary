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
          <Link className="btn btn-fab btn-primary" to="profileEdit" title="Edit Your Profile">
            <Edit btn={true}/>
          </Link>
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
                <Link className="btn btn-flat btn-primary" to="profileEdit" >Change Your Password</Link>
              </div>
              <div className="btn-container btn-container-righty">
                <Button flat={true} bsStyle="danger" onClick={this.logOut}>
                  <Logout className="icon"/> Log Out
                </Button>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
