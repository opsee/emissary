import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {is} from 'immutable';
import {plain as seed} from 'seedling';
import {connect} from 'react-redux';
import _ from 'lodash';

import SearchBox from './SearchBox.jsx';
import {Person, Checks, Help, Cloud, Login} from '../icons';
import {Col, Grid, Row} from '../layout';
import style from './header.css';

const Header = React.createClass({
  propTypes: {
    user: PropTypes.object.isRequired,
    team: PropTypes.object.isRequired,
    hide: PropTypes.bool,
    env: PropTypes.shape({
      activeBastion: PropTypes.object
    }).isRequired,
    activeBastion: PropTypes.bool
  },
  getInitialState(){
    return {
      ghosting: false
    };
  },
  shouldComponentUpdate(nextProps) {
    let arr = [];
    arr.push(!is(this.props.user, nextProps.user));
    arr.push(!is(this.props.team, nextProps.team));
    arr.push(this.props.activeBastion !== nextProps.activeBastion);
    return _.some(arr);
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
            <span className={`${style.navbarTitle}`}>Team</span>
          </Link>
        );
      }
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
  renderEnvironmentLink(){
    if (!!this.props.activeBastion) {
      return (
         <li>
           <Link to="/env" className={style.navbarLink} activeClassName="active">
             <Cloud nav/>&nbsp;
             <span className={`${style.navbarTitle}`}>Environment</span>
           </Link>
         </li>
      );
    }
    return null;
  },
  renderNavItems(){
    return (
      <ul className="list-unstyled display-flex justify-content-around" style={{margin: 0}}>
        <li>
         <Link to="/" className={style.navbarLink} activeClassName="active">
           <Checks nav/>&nbsp;
           <span className={`${style.navbarTitle}`}>Checks</span>
         </Link>
       </li>
       {this.renderEnvironmentLink()}
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

const mapStateToProps = (state) => ({
  team: state.team,
  user: state.user,
  activeBastion: !!state.env.activeBastion
});

export default connect(mapStateToProps)(Header);