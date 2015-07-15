import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';

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
                   <a className="md-navbar-link" href="/" ng-className="{'active':isActive('home')}">
                     <span className="md-navbar-title">Environment</span>
                   </a>
                 </li>
                  <li>
                   <a className="md-navbar-link" href="/checks" ng-className="{'active':isActive('checks')}">
                     <span className="md-navbar-title">Checks</span>
                   </a>
                 </li>
                  <li>
                   <a className="md-navbar-link" href="/more" ng-className="{'active':isActive('more')}">
                     <span className="md-navbar-title">More</span>
                   </a>
                 </li>
                 <li className="" ng-if="user.hasUser()">
                   <a className="md-navbar-link" href="/profile" ng-className="{'active':isActive('profile')}">
                     <span className="md-navbar-title">Profile</span>
                   </a>
                 </li>
                 <li className="" ng-if="!user.hasUser()">
                   <a className="md-navbar-link" href="/login" ng-className="{'active':isActive('login')}">
                     <span className="md-navbar-title">Login</span>
                   </a>
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