import React, {PropTypes} from 'react';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import {Toolbar} from '../global';
import {Link} from 'react-router';
import UserInputs from '../user/UserInputs.jsx';
import _ from 'lodash';
import router from '../../modules/router.js';
import {PageAuth} from '../../modules/statics';
import {Grid, Row, Col} from '../../modules/bootstrap';
import forms from 'newforms';
import {Button, BoundField} from '../forms';

const InfoForm = forms.Form.extend({
  email: forms.CharField({
    widgetAttrs:{
      placeholder:'email'
    }
  }),
  name: forms.CharField({
    widgetAttrs:{
      placeholder:'name'
    }
  }),
  password: forms.CharField({
    widget: forms.PasswordInput,
    widgetAttrs:{
      placeholder:'password'
    }
  })
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
    // const status = UserStore.
    this.setState({
      user:UserStore.getUser().toJS()
    });
  },
  getInitialState() {
    var self = this;
    return {
      info:new InfoForm(_.extend({
        onChange(){
          self.props.onChange(self.state.info.cleanedData);
          self.forceUpdate();
        },
        labelSuffix:'',
        validation:{
          on:'blur change',
          onChangeDelay:100
        },
      },self.dataComplete()))
    }
  },
  dataComplete(){
    UserStore.getUser()
    const test = _.chain(this.props.include).map(s => this.props[s]).every().value();
    if(test){
      return {
        data:this.props
      }
    }
  },
  componentWillMount(){
    UserActions.userGetUser(UserStore.getUser().get('id'));
  },
  render() {
    return (
       <div>
        <Toolbar title="Edit Your Profile"/>
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
              <BoundField bf={this.state.info.boundField('name')}/>
              <BoundField bf={this.state.info.boundField('email')}/>
              <BoundField bf={this.state.info.boundField('password')}/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});
