import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import router from '../../modules/router.js';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';

export default React.createClass({
  mixins: [UserStore.mixin],
  statics: {
    willTransitionTo(transition, params, query){
      if (!query.id || !query.token){
        transition.redirect('passwordForgot');
      }
    }
  },
  propTypes: {
    query: PropTypes.object
  },
  getInitialState(){
    return {
      status: null,
      password: null
    };
  },
  componentWillMount(){
    UserActions.userSet({
      token: this.props.query.token,
      user: _.assign(this.props.query, {
        loginDate: new Date()
      })
    });
  },
  storeDidChange(){
    const status = UserStore.getUserEditStatus();
    this.setState({status});
    if (status === 'success'){
      router.transitionTo('env');
    }else if (status && status !== 'pending'){
      console.error(status);
    }
  },
  getButtonText(){
    return this.state.status === 'pending' ? 'Changing...' : 'Change';
  },
  isDisabled(){
    return !this.state.password || this.state.status === 'pending';
  },
  setUserData(data){
    this.setState({password: data.password});
  },
  handleSubmit(e){
    e.preventDefault();
    UserActions.userEdit({password: this.state.password, id: this.props.query.id});
  },
  renderInner(){
    if (this.state.status === 'success'){
      return (
        <p>Success. Check your email.</p>
      );
    }
    return (
      <form name="loginForm" onSubmit={this.handleSubmit}>
        <p>Enter your new password here.</p>
        <UserInputs include={['password']}  onChange={this.setUserData}/>
        <Button color="success" block type="submit" disabled={this.isDisabled()}>
          {this.getButtonText()}
        </Button>
      </form>
    );
  },
  render() {
    return (
       <div>
        <Toolbar title="Change Your Password"/>
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
