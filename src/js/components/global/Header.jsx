import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';
import Link from 'react-router/lib/components/Link';
import {Person, Checkmark, MoreHoriz, Home} from '../icons/Module.jsx';
import UserStore from '../../stores/UserStore';

export default React.createClass({
  mixins: [UserStore.mixin],
  storeDidChange(){
    this.setState({
      user:UserStore.getUser()
    })
  },
  getInitialState(){
    return {
      user:UserStore.getUser()
    }
  },
  renderLoginButton(){
    if(this.state.user && this.state.user.id){
      return (
        <Link to="profile" className="md-navbar-link">
          <Person nav={true}/>&nbsp;
          <span className="md-navbar-title">Profile</span>
        </Link>
      )
    }else{
      return (
        <Link to="login" className="md-navbar-link">
          <span className="md-navbar-title">Login</span>
        </Link>
      )
    }
  },
  render(){
    return(
      <header id="header" ng-hide="hideHeader">
        <nav className="md-navbar" role="navigation">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                <ul className="md-navbar-list list-unstyled display-flex justify-content-around">
                  <li>
                   <Link to="home" className="md-navbar-link">
                     <Home nav={true}/>&nbsp;
                     <span className="md-navbar-title">Environment</span>
                   </Link>
                 </li>
                  <li>
                   <Link to="checks" className="md-navbar-link">
                     <Checkmark nav={true}/>&nbsp;
                     <span className="md-navbar-title">Checks</span>
                   </Link>
                 </li>
                  <li>
                   <Link to="more" className="md-navbar-link">
                     <MoreHoriz nav={true}/>&nbsp;
                     <span className="md-navbar-title">More</span>
                   </Link>
                 </li>
                 <li>
                   {this.renderLoginButton()}
                 </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        <SearchBox/>
        </header>
    )
  }
})