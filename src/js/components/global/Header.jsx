import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';
import Link from 'react-router/lib/components/Link';
import {Person, Checkmark, MoreHoriz} from '../icons/Module.jsx';

export default React.createClass({
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
                     <span className="md-navbar-title">Environment</span>
                   </Link>
                 </li>
                  <li>
                   <Link to="checks" className="md-navbar-link">
                     <Checkmark nav={true}/>
                     <span className="md-navbar-title">Checks</span>
                   </Link>
                 </li>
                  <li>
                   <Link to="more" className="md-navbar-link">
                     <span className="md-navbar-title">More</span>
                   </Link>
                 </li>
                 <li ng-if="user.hasUser()">
                   <Link to="profile" className="md-navbar-link">
                   <Person nav={true}/>
                     <span className="md-navbar-title">Profile</span>
                   </Link>
                 </li>
                 <li ng-if="!user.hasUser()">
                   <Link to="login" className="md-navbar-link">
                     <span className="md-navbar-title">Login</span>
                   </Link>
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