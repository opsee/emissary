import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import router from '../../modules/router.js';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';

export default React.createClass({
  mixins: [UserStore.mixin],
  storeDidChange(){
    const status = UserStore.getUserSendResetEmailStatus();
    this.setState({status});
  },
  getInitialState(){
    return {
      data: UserStore.getUser().toJS(),
      status: UserStore.getUserSendResetEmailStatus()
    }
  },
  updateUserData(data){
    this.setState({
      data: data
    })
  },
  submit(e){
    e.preventDefault();
    UserActions.userSendResetEmail(this.state.data);
  },
  disabled(){
    return !this.state.data.email || this.state.status == 'pending';
  },
  btnText(){
    return this.state.status == 'pending' ? 'Sending...' : 'Send Reset Email';
  },
  innerRender(){
    if (this.state.status == 'success'){
      return (
        <p>Success. Check your email.</p>
      )
    }else {
      return (
      <form name="loginForm" onSubmit={this.submit}>
        <p>Simply fill in your email and we&rsquo;ll message you with a shiny reset link.</p>
        <UserInputs include={['email']}  onChange={this.updateUserData} email={this.state.data.email}/>
        <Button type="submit" color="success" block={true} disabled={this.disabled()}>
          {this.btnText()}
        </Button>
      </form>
      );
    }
  },
  render() {
    return (
       <div>
        <Toolbar title="Forgot Password"/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.innerRender()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
