import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';

export default React.createClass({
  render(){
    return(
      <header id="header" ng-hide="hideHeader">
        <nav class="md-navbar" role="navigation">
          <div class="container">
            <div class="row">
              <div class="col-xs-12 col-sm-10 col-sm-offset-1">
                <ul class="md-navbar-list list-unstyled display-flex justify-content-around">
                  <li>
                   <a class="md-navbar-link" href="/" ng-class="{'active':isActive('home')}">
                     <span class="md-navbar-title">Environment</span>
                   </a>
                 </li>
                  <li>
                   <a class="md-navbar-link" href="/checks" ng-class="{'active':isActive('checks')}">
                     <span class="md-navbar-title">Checks</span>
                   </a>
                 </li>
                  <li>
                   <a class="md-navbar-link" href="/more" ng-class="{'active':isActive('more')}">
                     <span class="md-navbar-title">More</span>
                   </a>
                 </li>
                 <li class="" ng-if="user.hasUser()">
                   <a class="md-navbar-link" href="/profile" ng-class="{'active':isActive('profile')}">
                     <span class="md-navbar-title">Profile</span>
                   </a>
                 </li>
                 <li class="" ng-if="!user.hasUser()">
                   <a class="md-navbar-link" href="/login" ng-class="{'active':isActive('login')}">
                     <span class="md-navbar-title">Login</span>
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