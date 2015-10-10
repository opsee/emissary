import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';
import {Link} from 'react-router';
import {Person, Checkmark, MoreHoriz, Cloud, Login, Opsee} from '../icons';
import {UserStore, GlobalStore} from '../../stores';
import {Grid, Row, Col} from '../../modules/bootstrap';
import config from '../../modules/config';
import colors from 'seedling/colors';

import style from './header.css';

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
        <Link to="profile" className={style.navbarLink}>
          <Person nav={true}/>&nbsp;
          <span className={`${style.navbarTitle}`}>Profile</span>
        </Link>
      )
    }else{
      return (
        <Link to="login" className={style.navbarLink}>
          <Login nav={true}/>&nbsp;
          <span className={`${style.navbarTitle}`}>Login</span>
        </Link>
      )
    }
  },
  renderNavItems(){
  if(this.state.showNav){
    return (
      <ul className={`list-unstyled display-flex justify-content-around`}>
        <li>
         <Link to="checks" className={style.navbarLink}>
           <Checkmark nav={true}/>&nbsp;
           <span className={`${style.navbarTitle}`}>Checks</span>
         </Link>
       </li>
        <li>
         <Link to="env" className={style.navbarLink}>
           <Cloud nav={true}/>&nbsp;
           <span className={`${style.navbarTitle}`}>Environment</span>
         </Link>
       </li>
        <li>
         <Link to="more" className={style.navbarLink}>
           <MoreHoriz nav={true}/>&nbsp;
           <span className={`${style.navbarTitle}`}>More</span>
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
      <header id="header" className={`user-select-none ${style.header}`} style={this.getHeaderStyle()}>
        <nav className={style.navbar} role="navigation">
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