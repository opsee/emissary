import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';
import {Link} from 'react-router';
import {Person, Checkmark, MoreHoriz, Cloud, Login, Opsee} from '../icons';
import {UserStore, GlobalStore} from '../../stores';
import {Grid, Row, Col} from '../../modules/bootstrap';
import config from '../../modules/config';
import colors from 'seedling/colors';

export default React.createClass({
  mixins: [UserStore.mixin, GlobalStore.mixin],
  storeDidChange(){
    this.setState({
      showNav:GlobalStore.getShowNav(),
      ghosting:UserStore.getUser().get('admin_id') > 0
    });
    this.forceUpdate();
  },
  getInitialState(){
    return {
      showNav:GlobalStore.getShowNav()
    }
  },
  renderLoginLink(){
    if(UserStore.hasUser()){
      return (
        <Link to="profile" className="md-navbar-link">
          <Person nav={true}/>&nbsp;
          <span className="md-navbar-title">Profile</span>
        </Link>
      )
    }else{
      return (
        <Link to="login" className="md-navbar-link">
          <Login nav={true}/>&nbsp;
          <span className="md-navbar-title">Login</span>
        </Link>
      )
    }
  },
  renderNavItems(){
  if(this.state.showNav){
    return (
      <ul className="md-navbar-list list-unstyled display-flex justify-content-around">
        <li>
         <Link to="checks" className="md-navbar-link">
           <Checkmark nav={true}/>&nbsp;
           <span className="md-navbar-title">Checks</span>
         </Link>
       </li>
        <li>
         <Link to="env" className="md-navbar-link">
           <Cloud nav={true}/>&nbsp;
           <span className="md-navbar-title">Environment</span>
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
      );
    }
  },
  getHeaderStyle(){
    let obj = {};
    if(this.state.ghosting){
      obj.background = colors.danger;
    }
    return obj;
  },
  render(){
    return(
      <header id="header" className="user-select-none" style={this.getHeaderStyle()}>
        <nav className="md-navbar" role="navigation">
          <Grid>
            <Row>
              <Col xs={12} sm={10} smOffset={1}>
                {this.renderNavItems()}
              </Col>
            </Row>
          </Grid>
          </nav>
        <SearchBox/>
      </header>
    )
  }
})