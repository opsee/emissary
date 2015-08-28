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
                   <Opsee viewBox="0 0 24 12" style={{width:'60px',height:'40px'}}/>
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