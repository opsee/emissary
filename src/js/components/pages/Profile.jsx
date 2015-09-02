import React, {PropTypes} from 'react';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import {Toolbar} from '../global';
import {Link} from 'react-router';
import UserInputs from '../user/UserInputs.jsx';
import _ from 'lodash';
import router from '../../modules/router.js';

export default React.createClass({
  mixins: [UserStore.mixin],
  storeDidChange(){
    if(!UserStore.getAuth()){
      return router.transitionTo('login');
    }
    this.setState({
      user:UserStore.getUser()
    })
  },
  getInitialState(){
    return {
      user:UserStore.getUser()
    }
  },
  logOut(){
    return UserActions.userLogOut();
  },
  render() {
    return (
       <div>
        <Toolbar title="Your Profile"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <pre>{JSON.stringify(this.state.user, null, ' ')}</pre>
              <div>
                <button className="btn btn-warning" onClick={this.logOut}>Log Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
