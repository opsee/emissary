import React from 'react';
import {Toolbar} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
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
    };
  },
  getButtonText(){
    return this.state.status === 'pending' ? 'Sending...' : 'Send Reset Email';
  },
  isDisabled(){
    return !this.state.data.email || this.state.status === 'pending';
  },
  setUserData(data){
    this.setState({
      data: data
    });
  },
  handleSubmit(e){
    e.preventDefault();
    UserActions.userSendResetEmail(this.state.data);
  },
  renderInner(){
    if (this.state.status === 'success'){
      return (
        <p>Success. Check your email.</p>
      );
    }
    return (
      <form name="loginForm" onSubmit={this.handleSubmit}>
        <p>Simply fill in your email and we&rsquo;ll message you with a shiny reset link.</p>
        <UserInputs include={['email']}  onChange={this.setUserData} email={this.state.data.email}/>
        <Button type="submit" color="success" block disabled={this.isDisabled()}>
          {this.getButtonText()}
        </Button>
      </form>
    );
  },
  render() {
    return (
       <div>
        <Toolbar title="Forgot Password"/>
        <Grid>
          <Row>
            <Col xs={12}>
              {this.renderInner()}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
