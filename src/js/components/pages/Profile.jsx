import React, {PropTypes} from 'react';
import Store from '../../stores/User';
import UserActions from '../../actions/User';
import Toolbar from '../global/Toolbar.jsx';
import Link from 'react-router/lib/components/Link';
import UserInputs from '../user/UserInputs.jsx';
import _ from 'lodash';
import router from '../../router.jsx';

export default React.createClass({
  mixins: [Store.mixin],
  storeDidChange(){
    // const status = Store.getStatus();
    // this.setState({status})
    // if(status.success){
    //   router.transitionTo('home');
    // }else{
    // }
    if(!Store.getAuth()){
      return router.transitionTo('login');
    }
    this.setState({
      user:Store.getUser()
    })
  },
  getInitialState(){
    return {
      user:Store.getUser()
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
