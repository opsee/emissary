import React, {PropTypes} from 'react';
import {UserStore} from '../../stores';
import {UserActions, GlobalActions} from '../../actions';
import {Toolbar} from '../global';
import {Link} from 'react-router';
import _ from 'lodash';
import router from '../../modules/router.js';
import {PageAuth} from '../../modules/statics';
import {Grid, Row, Col} from '../../modules/bootstrap';
import forms from 'newforms';
import {Button, BoundField} from '../forms';
import UserInputs from './UserInputs.jsx';
import {Lock} from '../icons';

const PasswordForm = forms.Form.extend({
  password: forms.CharField({
    widget: forms.PasswordInput,
    label:'New Password',
    widgetAttrs:{
      placeholder:'Enter a new password'
    },
    required:false
  }),
  render(){
    return (
      <BoundField bf={this.boundField('password')}>
        <Lock className="icon"/>
      </BoundField>
    )
  }
});

function getData(){
  UserStore.getUser()
}

export default React.createClass({
  mixins: [UserStore.mixin],
  statics:{
    willTransitionTo:PageAuth
  },
  storeDidChange(){
    const status = UserStore.getUserGetUserStatus();
    if(status == 'success'){
      this.setState({
        user:UserStore.getUser().toJS(),
        passwordForm:this.getForm()
      });
    }
    const editStatus = UserStore.getUserEditStatus();
    if(editStatus == 'success'){
      router.transitionTo('profile');
    }else if(editStatus && editStatus != 'pending'){
      GlobalActions.globalModalMessage({
        html:'Something went wrong.'
      })
    }
  },
  getInitialState() {
    // return this.getForm();
    return {
      user:UserStore.getUser().toJS(),
      passwordForm:this.getForm()
    }
  },
  getForm(){
    var self = this;
    return new PasswordForm({
      onChange(){
        self.updatePassword(self.state.passwordForm.cleanedData);
        self.forceUpdate();
      },
      labelSuffix:'',
      validation:{
        on:'blur change',
        onChangeDelay:100
      },
    });
  },
  updateUserData(data, isComplete){
    let user = _.clone(this.state.user);
    user.name = data.name;
    user.email = data.email;
    this.setState({user});
  },
  updatePassword(data){
    this.setState({password:data.password})
  },
  dataComplete(){
    return UserStore.getUser().get('name') && UserStore.getUser().toJS();
  },
  componentWillMount(){
    if(!this.dataComplete()){
      UserActions.userGetUser(UserStore.getUser().get('id'));
    }
  },
  submit(e){
    e.preventDefault();
    let data = this.state.user;
    if(this.state.password){
      data.password = this.state.password;
    }
    UserActions.userEdit(data);
  },
  disabled(){
    return !(this.state.user.email && this.state.user.name);
  },
  render() {
    return (
       <div>
        <Toolbar title="Edit Your Profile"/>
        <Grid>
          <Row>
            <Col xs={12}>
            <form onSubmit={this.submit}>
              <UserInputs include={['email', 'name']}  onChange={this.updateUserData} email={this.state.user.email} name={this.state.user.name}/>
              {this.state.passwordForm.render()}
              <Button bsStyle="primary" type="submit" disabled={this.disabled()}>Submit</Button>
            </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
