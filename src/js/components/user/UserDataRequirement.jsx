import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import router from '../../modules/router.js';
import {Link} from 'react-router';
import {Grid, Row, Col} from '../../modules/bootstrap';
import config from '../../modules/config';
import _ from 'lodash';

export default React.createClass({
  propTypes:{
    hideIf:PropTypes.string,
    showIf:PropTypes.string,
    currentRevision:PropTypes.bool
  },
  mixins: [UserStore.mixin],
  storeDidChange(){
    const status = UserStore.getUserGetUserDataStatus();
    if(status == 'success'){
      this.setState({data:UserStore.getUserData()});
    }
  },
  getInitialState(){
    return {
      data:UserStore.getUserData(),
    }
  },
  componentWillMount(){
    const data = UserStore.getUserData();
    if(!data){
      UserActions.userGetUserData();
    }else{
      this.setState({data});
    }
  },
  generateBool(){
    if(!this.state.data){
      return false;
    }
    const property = this.props.hideIf || this.props.showIf;
    let selection = this.state.data[property];
    if(this.props.currentRevision && Array.isArray(selection)){
      selection = _.filter(selection, {revision:config.revision}).length;
    }
    if(this.props.hideIf){
      return !(selection);
    }else if(this.props.showIf){
      return !!(selection);
    }
  },
  render() {
    if(this.generateBool()){
      return (
        <div>
          {this.props.children}
        </div>
      );
    }else{
      return <div/>
    }
  }
});
