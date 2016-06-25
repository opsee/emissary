import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {plain as seed} from 'seedling';
import {connect} from 'react-redux';
import cx from 'classnames';

import {scheme} from '../../modules';
import SearchBox from './SearchBox.jsx';
import {Person, Checks, Help, Cloud, Login} from '../icons';
import {Col, Grid, Row} from '../layout';
import style from './header.css';

const Header = React.createClass({
  propTypes: {
    user: PropTypes.object.isRequired,
    hide: PropTypes.bool,
    redux: PropTypes.shape({
      env: PropTypes.shape({
        activeBastion: PropTypes.object
      })
    }).isRequired
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
    }, style[scheme()]);
  },
  getHeaderStyle(){
    let obj = {};
    if (this.props.user.get('ghosting')){
      obj.background = seed.color.danger;
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
  renderEnvironmentLink(){
    if (!!this.props.redux.env.activeBastion) {
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
      <header id="header" className={this.getHeaderClass()} style={this.getHeaderStyle()}>
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
  redux: state
});

export default connect(mapStateToProps)(Header);