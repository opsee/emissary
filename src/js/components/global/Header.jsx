import React from 'react';
import SearchBox from './SearchBox.jsx';
import {Link} from 'react-router';
import {Person, Checkmark, Help, Cloud, Login} from '../icons';
import {UserStore, GlobalStore} from '../../stores';
import {Grid, Row, Col} from '../../modules/bootstrap';
import colors from 'seedling/colors';
import config from '../../modules/config';

import style from './header.css';

const Header = React.createClass({
  mixins: [UserStore.mixin, GlobalStore.mixin],
  storeDidChange(){
    this.setState({
      showNav: GlobalStore.getShowNav(),
      ghosting: UserStore.getUser().get('admin_id') > 0 || config.ghosting
    });
    this.forceUpdate();
  },
  getInitialState(){
    return {
      showNav: GlobalStore.getShowNav()
    };
  },
  getHeaderStyle(){
    let obj = {};
    if (this.state.ghosting){
      obj.background = colors.danger;
    }
    return obj;
  },
  renderLoginLink(){
    if (UserStore.hasUser()){
      return (
        <Link to="/profile" className={style.navbarLink}>
          <Person nav/>&nbsp;
          <span className={`${style.navbarTitle}`}>Profile</span>
        </Link>
      );
    }
    return (
      <Link to="/login" className={style.navbarLink}>
        <Login nav/>&nbsp;
        <span className={`${style.navbarTitle}`}>Login</span>
      </Link>
    );
  },
  renderNavItems(){
    return (
      <ul className={`list-unstyled display-flex justify-content-around`} style={{margin: 0}}>
        <li>
         <Link to="/" className={style.navbarLink}>
           <Checkmark nav/>&nbsp;
           <span className={`${style.navbarTitle}`}>Checks</span>
         </Link>
       </li>
        <li>
         <Link to="/env" className={style.navbarLink}>
           <Cloud nav/>&nbsp;
           <span className={`${style.navbarTitle}`}>Environment</span>
         </Link>
       </li>
        <li>
         <Link to="/help" className={style.navbarLink}>
           <Help nav/>&nbsp;
           <span className={`${style.navbarTitle}`}>Help</span>
         </Link>
       </li>
       <li>
         {this.renderLoginLink()}
       </li>
      </ul>
      );
  },
  render(){
    return (
      <header id="header" className={this.state.showNav ? style.header : style.headerHide} style={this.getHeaderStyle()}>
        <nav className={style.navbar} role="navigation">
          <Grid>
            <Row>
              <Col xs={12}>
                {this.renderNavItems()}
              </Col>
            </Row>
          </Grid>
          </nav>
        <SearchBox/>
      </header>
    );
  }
});

export default Header;