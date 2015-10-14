import React, {PropTypes} from 'react';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import {Toolbar} from '../global';
import {Link} from 'react-router';
import UserInputs from '../user/UserInputs.jsx';
import _ from 'lodash';
import router from '../../modules/router.js';
import {PageAuth} from '../../modules/statics';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';
import {Edit} from '../icons';

export default React.createClass({
  mixins: [UserStore.mixin],
  statics:{
    willTransitionTo:PageAuth
  },
  storeDidChange(){
    if(!UserStore.getAuth()){
      return router.transitionTo('login');
    }
    this.setState({
      user:UserStore.getUser().toJS()
    })
  },
  getInitialState(){
    return {
      user:UserStore.getUser().toJS()
    }
  },
  logOut(){
    return UserActions.userLogOut();
  },
  render() {
    return (
       <div>
        <Toolbar title="Your Profile">
          <Link className="btn btn-fab btn-primary" to="profileEdit" title="Edit Your Profile">
            <Edit btn={true}/>
          </Link>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
              <h2>{this.state.user.name}</h2>
              <div>Email: {this.state.user.email}</div>
              <div>
                <div><br/><br/></div>
                <Button bsStyle="default" onClick={this.logOut}>Log Out</Button>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
