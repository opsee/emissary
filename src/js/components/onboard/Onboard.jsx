import React, {PropTypes} from 'react';
import { RouteTransition } from 'react-router-transition';
import { spring } from 'react-motion';
import { OrderedMap } from 'immutable';

import { Close } from '../icons';
import { Padding } from '../layout';
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

export default React.createClass({
  render(){
    return(
      <div className={style.container}>
        <Padding a={2} className={style.closeWrapper} >
          <Close className={style.closeButton} />
        </Padding>

        <Padding t={4}>
          <RouteTransition pathname={this.props.location.pathname} {...slideLeft} className={style.transitionContainer}>
            {this.props.children}
          </RouteTransition>
        </Padding>
      </div>
    );
  }
});