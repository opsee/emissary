/* eslint-disable */
import _ from 'lodash';
import cx from 'classnames';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { RouteTransition } from 'react-router-transition';
import { spring } from 'react-motion';
import { History } from 'react-router';
import { OrderedMap } from 'immutable';

import { Circle, Close } from '../icons';
import { Padding } from '../layout';
import { app as actions } from '../../actions';
import style from './onboard.css';

const fadeConfig = { stiffness: 200, damping: 22 };
const popConfig = { stiffness: 360, damping: 25 };
const slideConfig = { stiffness: 330, damping: 30 };

const routes = [
  // '/start/review-stack',
  '/start/launch-stack',
  // '/start/review-instance',
  '/start/launch-instance',
  '/start/install-example'
];

const slideLeft = {
  atEnter: {
    opacity: 0,
    offset: 100
  },
  atLeave: {
    opacity: spring(0, fadeConfig),
    offset: spring(-100, slideConfig)
  },
  atActive: {
    opacity: spring(1, slideConfig),
    offset: spring(0, slideConfig)
  },
  mapStyles(styles) {
    return {
      opacity: styles.opacity,
      transform: `translateX(${styles.offset}%)`
    };
  }
};

const Onboard = React.createClass({
  mixins: [History],
  propTypes: {

  },
  isInstalling(){
    const pathname = this.props.location.pathname;
    return pathname === '/start/install' || pathname === '/start/install-example';
  },
  onClose(){
    if (this.isInstalling()) {
      this.history.pushState(null, '/');
    } else {
      this.props.actions.confirmOpen({
        html: '<p>Are you sure you want to cancel installation? You can come back at any time.</p>',
        confirmText: 'Yes, cancel',
        color: 'danger',
        onConfirm: this.props.history.pushState.bind(null, null, '/')
      });
    }
  },
  renderPips(){
    const route = this.props.location.pathname;
    const activePip = routes.indexOf(route);
    if (activePip < 0) {
      return null;
    }
    const totalPips = routes.length;
    return _.times(totalPips, i => {
      const className = cx(style.pip, {[style.activePip]: i == activePip});
      return (
        <Circle className={className} />
      );
    });
  },
  render(){
    return(
      <div className={style.container}>
        <div onClick={this.onClose}>
          <Padding a={2} className={style.closeWrapper} >
            <Close className={style.closeButton} />
          </Padding>
        </div>
        <Padding className={style.pips}>
          {this.renderPips()}
        </Padding>
        <Padding t={1}>
          {this.props.children}
        </Padding>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(Onboard);