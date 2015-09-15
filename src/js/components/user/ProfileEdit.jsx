import React, {PropTypes} from 'react';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import {Toolbar} from '../global';
import {Link} from 'react-router';
import _ from 'lodash';
import router from '../../modules/router.js';
import {PageAuth} from '../../modules/statics';
import {Grid, Row, Col} from '../../modules/bootstrap';
import forms from 'newforms';
import {Button, BoundField} from '../forms';
import UserInputs from './UserInputs.jsx';

const PasswordForm = forms.Form.extend({
  password: forms.CharField({
    widget: forms.PasswordInput,
    widgetAttrs:{
      placeholder:'password'
    }
  }),
  render(){
    return <BoundField bf={this.boundField('password')}/>
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
        password:this.getForm()
      });
    }
  },
  getInitialState() {
    // return this.getForm();
    return {
      user:UserStore.getUser().toJS(),
      password:this.getForm()
    }
  },
  getForm(){
    var self = this;
    return new PasswordForm({
      onChange(){
        self.props.onChange(self.state.info.cleanedData);
        self.forceUpdate();
      },
      labelSuffix:'',
      validation:{
        on:'blur change',
        onChangeDelay:100
      },
    });
  },
  updateUserData(data){
    this.setState({
      info:data
    })
  },
  updatePassword(password){
    this.setState({password})
  },
  dataComplete(){
    return UserStore.getUser().get('name') && UserStore.getUser().toJS();
  },
  componentWillMount(){
    if(!this.dataComplete()){
      UserActions.userGetUser(UserStore.getUser().get('id'));
    }
  },
  submit(){

  },
  render() {
    return (
       <div>
        <Toolbar title="Edit Your Profile"/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
            <form onSubmit={this.submit}>
              <UserInputs include={['email', 'name']}  onChange={this.updateUserData} email={this.state.user.email} name={this.state.user.name}/>
              {this.state.password.render()}
              <Button bsStyle="primary" type="submit">Submit</Button>
            </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
