import React, {PropTypes} from 'react';
import {UserStore} from '../../stores';
import {UserActions} from '../../actions';
import config from '../../modules/config';
import _ from 'lodash';

export default React.createClass({
  mixins: [UserStore.mixin],
  propTypes: {
    hideIf: PropTypes.string,
    showIf: PropTypes.string,
    currentRevision: PropTypes.bool,
    children: PropTypes.node
  },
  getInitialState(){
    return {
      data: UserStore.getUserData()
    };
  },
  componentWillMount(){
    const data = UserStore.getUserData();
    if (!data){
      UserActions.userGetUserData();
    }else {
      this.setState({data});
    }
  },
  storeDidChange(){
    const status = UserStore.getUserGetUserDataStatus();
    if (status === 'success'){
      this.setState({data: UserStore.getUserData()});
    }
  },
  getBool(){
    if (!this.state.data){
      return false;
    }
    const property = this.props.hideIf || this.props.showIf;
    let selection = this.state.data[property];
    if (this.props.currentRevision && Array.isArray(selection)){
      selection = _.filter(selection, {revision: config.revision}).length;
    }
    if (this.props.hideIf){
      return !(selection);
    }else if (this.props.showIf){
      return !!(selection);
    }
  },
  render() {
    if (this.getBool()){
      return (
        <div>
          {this.props.children}
        </div>
      );
    }
    return <div/>;
  }
});
