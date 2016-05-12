import React, {PropTypes} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { RouteTransition } from 'react-router-transition';
import { spring } from 'react-motion';
import { History } from 'react-router';
import { OrderedMap } from 'immutable';

import { Close } from '../icons';
import { Padding } from '../layout';
import { app as actions } from '../../actions';
import style from './onboard.css';

const fadeConfig = { stiffness: 200, damping: 22 };
const popConfig = { stiffness: 360, damping: 25 };
const slideConfig = { stiffness: 330, damping: 30 };

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
  onClose(){
    this.props.actions.confirmOpen({
      html: '<p>Are you sure you want to cancel installation? You can come back at any time.</p>',
      confirmText: 'Yes, cancel',
      color: 'danger',
      onConfirm: this.props.history.pushState.bind(null, null, '/')
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

        <Padding t={4}>
          <RouteTransition pathname={this.props.location.pathname} {...slideLeft} className={style.transitionContainer}>
            {this.props.children}
          </RouteTransition>
        </Padding>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(Onboard);