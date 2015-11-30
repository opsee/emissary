import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';
import {Link} from 'react-router';
import {Person, Checkmark, Help, Cloud, Login} from '../icons';
import {Grid, Row, Col} from '../../modules/bootstrap';
import colors from 'seedling/colors';

import style from './header.css';

const Header = React.createClass({
  propTypes: {
    user: PropTypes.object.isRequired,
    hide: PropTypes.bool
  },
  getInitialState(){
    return {
      ghosting: false
    };
  },
  getHeaderStyle(){
    let obj = {};
    if (this.props.user.get('ghosting')){
      obj.background = colors.danger;
    }
    return obj;
  },
  renderLoginLink(){
    if (this.props.user.get('auth')){
      return (
        <Link to="/profile" className={style.navbarLink} activeClassName="active">
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
         <Link to="/" className={style.navbarLink} activeClassName="active">
           <Checkmark nav/>&nbsp;
           <span className={`${style.navbarTitle}`}>Checks</span>
         </Link>
       </li>
        <li>
         <Link to="/env" className={style.navbarLink} activeClassName="active">
           <Cloud nav/>&nbsp;
           <span className={`${style.navbarTitle}`}>Environment</span>
         </Link>
       </li>
        <li>
         <Link to="/help" className={style.navbarLink} activeClassName="active">
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
      <header id="header" className={this.props.hide ? style.headerHide : style.header} style={this.getHeaderStyle()}>
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