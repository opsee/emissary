import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import router from '../../modules/router.js';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';

export default React.createClass({
  mixins: [UserStore.mixin],
  statics:{
    willTransitionTo(transition, params, query){
      if(!query.id || !query.token){
        transition.redirect('passwordForgot');
      }
    }
  },
  storeDidChange(){
    const status = UserStore.getUserEditStatus();
    this.setState({status})
    if(status == 'success'){
      router.transitionTo('env');
    }else if(status && status != 'pending'){
      console.error(status);
    }
  },
  getInitialState(){
    return {
      status:null,
      password:null
    }
  },
  updateUserData(data){
    this.setState({password:data.password});
  },
  submit(e){
    e.preventDefault();
    UserActions.userEdit({password:this.state.password, id:this.props.query.id});
  },
  componentWillMount(){
    UserActions.userSet(this.props.query);
  },
  disabled(){
    return !this.state.password || this.state.status == 'pending';
  },
  btnText(){
    return this.state.status == 'pending' ? 'Changing...' : 'Change';
  },
  innerRender(){
    if(this.state.status == 'success'){
      return (
        <p>Success. Check your email.</p>
      )
    }else{
      return (
      <form name="loginForm" ng-submit="submit()" onSubmit={this.submit}>
        <p>Enter your new password here.</p>
        <UserInputs include={['password']}  onChange={this.updateUserData}/>
        <button type="submit" className="btn btn-raised btn-success btn-block ng-disabled" disabled={this.disabled()}>
          <span>
            {this.btnText()}
          </span>
        </button>
      </form>
      );
    }
  },
  render() {
    return (
       <div>
        <Toolbar title="Change Your Password"/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              {this.innerRender()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
