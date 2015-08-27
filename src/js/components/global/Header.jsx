import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';
import {Link} from 'react-router';
import {Person, Checkmark, MoreHoriz, Home, Opsee} from '../icons/Module.jsx';
import UserStore from '../../stores/User';
import {Grid, Row, Col} from 'react-bootstrap';

export default React.createClass({
  mixins: [UserStore.mixin],
  storeDidChange(){
    this.forceUpdate();
  },
  renderLoginLink(){
    if(UserStore.getAuth()){
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
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1}>
                <ul className="md-navbar-list list-unstyled display-flex justify-content-around">
                  <li>
                   <Link to="home" className="md-navbar-link" style={{padding:'5px'}}>
                     <svg xmlns="http://www.w3.org/svg/2000" viewBox="0 0 24 12" style={{width:'60px',height:'40px'}}>
                        <path d="M2.6,2.2c-0.2,0-0.4,0.2-0.4,0.4v5.9c0,0.2,0.2,0.4,0.4,0.4c0.2,0,0.4-0.2,0.4-0.4V2.6C2.9,2.4,2.8,2.2,2.6,2.2 z M7,2.2c-0.2,0-0.4,0.2-0.4,0.4v5.9c0,0.2,0.2,0.4,0.4,0.4c0.2,0,0.4-0.2,0.4-0.4V2.6C7.3,2.4,7.2,2.2,7,2.2z M15.8,5.1 c0.2,0,0.4-0.2,0.4-0.4V2.6c0-0.2-0.2-0.4-0.4-0.4s-0.4,0.2-0.4,0.4v2.2C15.4,5,15.6,5.1,15.8,5.1z M20.2,2.2 c-0.2,0-0.4,0.2-0.4,0.4v2.2c0,0.2,0.2,0.4,0.4,0.4c0.2,0,0.4-0.2,0.4-0.4V2.6C20.5,2.4,20.4,2.2,20.2,2.2z M20.2,0 c-0.9,0-1.7,0.5-2.2,1.2C17.5,0.5,16.7,0,15.8,0S14,0.5,13.6,1.2C13.1,0.5,12.3,0,11.4,0c-0.9,0-1.7,0.5-2.2,1.2C8.7,0.5,7.9,0,7,0 S5.2,0.5,4.8,1.2C4.3,0.5,3.5,0,2.6,0C1.2,0,0,1.2,0,2.6v5.9C0,9.8,1.2,11,2.6,11c0.7,0,1.4-0.3,1.8-0.8v2.2c0,0.8,0.7,1.5,1.5,1.5 s1.5-0.7,1.5-1.5V11c0.8-0.1,1.4-0.6,1.8-1.2c0.4,0.7,1.3,1.2,2.2,1.2c0.9,0,1.7-0.5,2.2-1.2c0.4,0.7,1.3,1.2,2.2,1.2 s1.7-0.5,2.2-1.2c0.4,0.7,1.3,1.2,2.2,1.2c1.4,0,2.6-1.2,2.6-2.6V2.6C22.7,1.2,21.6,0,20.2,0z M2.6,10.3c-1,0-1.8-0.8-1.8-1.8V2.6 c0-1,0.8-1.8,1.8-1.8s1.8,0.8,1.8,1.8v5.9C4.4,9.4,3.6,10.3,2.6,10.3z M7,10.3L7,10.3c-0.2,0-0.4,0.2-0.4,0.4v1.8 c0,0.4-0.4,0.8-0.8,0.7c-0.4,0-0.7-0.4-0.7-0.8v-4l0,0V2.6c0-1,0.7-1.8,1.7-1.9c1.1-0.1,2,0.8,2,1.8v5.9C8.8,9.4,8,10.3,7,10.3z  M11.2,10.3c-0.9-0.1-1.7-0.9-1.7-1.9v-1C9.5,7.1,9.7,7,9.9,7h0.7C10.8,7,11,7.1,11,7.3v1.1c0,0.2,0.1,0.4,0.3,0.4 c0.2,0,0.4-0.1,0.4-0.4V7.3c0-0.6-0.5-1.1-1.1-1.1l0,0c-0.6,0-1.1-0.5-1.1-1.1V2.6c0-1,0.7-1.8,1.7-1.9c1.1-0.1,2,0.8,2,1.8v1.1 C13.2,3.9,13,4,12.8,4h-0.7c-0.2,0-0.4-0.2-0.4-0.4V2.6c0-0.2-0.1-0.4-0.3-0.4c-0.2,0-0.4,0.1-0.4,0.4v1.1c0,0.6,0.5,1.1,1.1,1.1 l0,0c0.6,0,1.1,0.5,1.1,1.1v2.6C13.2,9.5,12.3,10.4,11.2,10.3z M15.6,10.3c-0.9-0.1-1.7-0.9-1.7-1.9V2.6c0-1,0.7-1.8,1.7-1.9 c1.1-0.1,2,0.8,2,1.8v3.7c0,0.2-0.2,0.4-0.4,0.4h-0.7c-0.6,0-1.1,0.5-1.1,1.1v0.7c0,0.2,0.1,0.4,0.3,0.4c0.2,0,0.4-0.1,0.4-0.4V7.7 c0-0.2,0.2-0.4,0.4-0.4h0.7c0.2,0,0.4,0.2,0.4,0.4v0.7C17.6,9.5,16.7,10.4,15.6,10.3z M22,6.2c0,0.2-0.2,0.4-0.4,0.4h-0.7 c-0.6,0-1.1,0.5-1.1,1.1v0.7c0,0.2,0.1,0.4,0.3,0.4c0.2,0,0.4-0.1,0.4-0.4V7.7c0-0.2,0.2-0.4,0.4-0.4h0.7c0.2,0,0.4,0.2,0.4,0.4v0.7 c0,1.1-0.9,1.9-2,1.8c-0.9-0.1-1.7-0.9-1.7-1.9V2.6c0-1,0.7-1.8,1.7-1.9c1.1-0.1,2,0.8,2,1.8V6.2z"/>
                      </svg>
                     {
                     // <img src="/img/logo-mono-white.svg" width="70"/>
                     }
                   </Link>
                 </li>
                 {
                 //  <li>
                 //   <Link to="home" className="md-navbar-link">
                 //     <Home nav={true}/>&nbsp;
                 //     <span className="md-navbar-title">Environment</span>
                 //   </Link>
                 // </li>
                 }
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
                   {this.renderLoginLink()}
                 </li>
                </ul>
                </Col>
              </Row>
            </Grid>
          </nav>
        <SearchBox/>
        </header>
    )
  }
})