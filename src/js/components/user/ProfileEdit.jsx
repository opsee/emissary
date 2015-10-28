import React from 'react';
import {UserStore} from '../../stores';
import {UserActions, GlobalActions} from '../../actions';
import {Toolbar} from '../global';
import _ from 'lodash';
import router from '../../modules/router.js';
import {PageAuth} from '../../modules/statics';
import {Grid, Row, Col} from '../../modules/bootstrap';
import forms from 'newforms';
import {Button, BoundField} from '../forms';
import UserInputs from './UserInputs.jsx';
import {Lock, Close} from '../icons';
import {Padding} from '../layout';

const PasswordForm = forms.Form.extend({
  password: forms.CharField({
    widget: forms.PasswordInput,
    label: 'New Password',
    widgetAttrs: {
      placeholder: 'Enter a new password'
    },
    required: false
  }),
  render(){
    return (
      <BoundField bf={this.boundField('password')}>
        <Lock className="icon"/>
      </BoundField>
    );
  }
});

export default React.createClass({
  mixins: [UserStore.mixin],
  statics: {
    willTransitionTo: PageAuth
  },
  getInitialState() {
    // return this.getForm();
    return {
      user: UserStore.getUser().toJS(),
      passwordForm: this.getForm()
    };
  },
  componentWillMount(){
    if (!this.isDataComplete()){
      UserActions.userGetUser(UserStore.getUser().get('id'));
    }
  },
  storeDidChange(){
    const status = UserStore.getUserGetUserStatus();
    if (status === 'success'){
      this.setState({
        user: UserStore.getUser().toJS(),
        passwordForm: this.getForm()
      });
    }
    const editStatus = UserStore.getUserEditStatus();
    if (editStatus === 'success'){
      router.transitionTo('profile');
    }else if (editStatus && editStatus !== 'pending'){
      GlobalActions.globalModalMessage({
        html: 'Something went wrong.'
      });
    }
  },
  isDataComplete(){
    return UserStore.getUser().get('name') && UserStore.getUser().toJS();
  },
  isDisabled(){
    return !(this.state.user.email && this.state.user.name);
  },
  getForm(){
    const self = this;
    return new PasswordForm({
      onChange(){
        self.setState({password: self.state.passwordForm.cleanedData.password});
      },
      labelSuffix: '',
      validation: {
        on: 'blur change',
        onChangeDelay: 100
      }
    });
  },
  handleUserData(data){
    let user = _.clone(this.state.user);
    user.name = data.name;
    user.email = data.email;
    this.setState({user});
  },
  handleSubmit(e){
    e.preventDefault();
    let data = this.state.user;
    if (this.state.password){
      data.password = this.state.password;
    }
    UserActions.userEdit(data);
  },
  render() {
    return (
       <div>
        <Toolbar title="Edit Your Profile" bg="info" btnPosition="midRight">
          <Button to="profile" icon flat>
            <Close btn/>
          </Button>
        </Toolbar>
        <Grid>
          <Row>
            <Col xs={12}>
            <form onSubmit={this.handleSubmit}>
              <UserInputs include={['email', 'name']}  onChange={this.handleUserData} email={this.state.user.email} name={this.state.user.name}/>
              {this.state.passwordForm.render()}
              <Padding t={2}>
                <Button color="primary" type="submit" disabled={this.isDisabled()}>Update Profile</Button>
              </Padding>
            </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
