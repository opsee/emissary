import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {plain as seed} from 'seedling';
import {connect} from 'react-redux';
import cx from 'classnames';

import LogoColor from './LogoColor';
import SearchBox from './SearchBox.jsx';
import {Person, Checks, Help, Cloud, Login} from '../icons';
import {Col, Grid, Row} from '../layout';
import style from './header.css';

const Header = React.createClass({
  propTypes: {
    user: PropTypes.object.isRequired,
    team: PropTypes.object.isRequired,
    hide: PropTypes.bool,
    scheme: PropTypes.string,
    activeBastion: PropTypes.bool
  },
  getInitialState(){
    return {
      ghosting: false
    };
  },
  getHeaderClass(){
    return cx({
      [style.header]: true,
      [style.headerHide]: this.props.hide
    }, style[this.props.scheme]);
  },
  getHeaderStyle(){
    let obj = {};
    if (this.props.user.get('ghosting')){
      obj.background = seed.color.danger;
    }
    return obj;
  },
  shouldRenderTeam(){
    return this.props.team.toJS().users.length > 1;
  },
  renderLoginLink(){
    if (this.props.user.get('auth')){
      if (this.shouldRenderTeam()){
        return (
          <Link to="/team" className={style.navbarLink} activeClassName="active">
            <Person nav/>&nbsp;
            <span className={style.navbarTitle}>Team</span>
          </Link>
        );
      }
      return (
        <Link to="/profile" className={style.navbarLink} activeClassName="active">
          <Person nav/>&nbsp;
          <span className={style.navbarTitle}>Profile</span>
        </Link>
      );
    }
    return (
      <Link to="/login" className={style.navbarLink}>
        <Login nav/>&nbsp;
        <span className={style.navbarTitle}>Login</span>
      </Link>
    );
  },
  renderEnvironmentLink(){
    if (!!this.props.activeBastion) {
      return (
         <li>
           <Link to="/env" className={style.navbarLink} activeClassName="active">
             <Cloud nav/>&nbsp;
             <span className={style.navbarTitle}>Env<span className="hidden-xs">ironment</span></span>
           </Link>
         </li>
      );
    }
    return null;
  },
  renderNavItems(){
    return (
      <ul className={style.navList}>
        <li>
         <Link to="/" className={style.navbarLink} activeClassName="active">
           <Checks nav/>&nbsp;
           <span className={style.navbarTitle}>Checks</span>
         </Link>
       </li>
       <li>
         <Link to="/events" className={style.navbarLink} activeClassName="active">
           <Cloud nav/>&nbsp;
           <span className={style.navbarTitle}>Events</span>
         </Link>
       </li>
       {this.renderEnvironmentLink()}
        <li>
         <Link to="/help" className={style.navbarLink} activeClassName="active">
           <Help nav/>&nbsp;
           <span className={style.navbarTitle}>Help</span>
         </Link>
       </li>
       <li>
         {this.renderLoginLink()}
       </li>
      </ul>
      );
  },
  render() {
    return (
      <header id="header" className={this.getHeaderClass()} style={this.getHeaderStyle()}>
        <Grid>
          <Row>
            <Col xs={12}>
              <div className={style.inner}>
                <div className={style.logoWrapper}>
                  <Link to="/"><LogoColor borderColor="light" className={style.logo}/></Link>
                </div>

                <nav className={style.navbar} role="navigation">
                  {this.renderNavItems()}
                </nav>
                <SearchBox/>
              </div>
            </Col>
          </Row>
        </Grid>
      </header>
    );
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme,
  team: state.team,
  user: state.user,
  activeBastion: !!state.env.activeBastion
});

export default connect(mapStateToProps, null, null, {pure: false})(Header);