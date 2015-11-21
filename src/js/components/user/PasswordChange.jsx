import React, {PropTypes} from 'react';
import {History} from 'react-router';
import _ from 'lodash';
import {Toolbar} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import {Grid, Row, Col} from '../../modules/bootstrap';
import {Button} from '../forms';

export default React.createClass({
  mixins: [UserStore.mixin, History],
  propTypes: {
    location: PropTypes.object
  },
  getInitialState(){
    return {
      status: null,
      password: null
    };
  },
  componentWillMount(){
    if (!this.props.location.query.id || !this.props.location.query.token){
      this.history.replaceState(null, '/password-forgot');
    }
    UserActions.userSet({
      token: this.props.location.query.token,
      user: _.assign(this.props.location.query, {
        loginDate: new Date()
      })
    });
  },
  storeDidChange(){
    const status = UserStore.getUserEditStatus();
    this.setState({status});
    if (status === 'success'){
      this.history.pushState(null, '/env');
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
    UserActions.userEdit({password: this.state.password, id: this.props.location.query.id});
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
