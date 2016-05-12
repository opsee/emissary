import React, {PropTypes} from 'react';
import { RouteTransition } from 'react-router-transition';
import { spring } from 'react-motion';
import { OrderedMap } from 'immutable';
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
    console.log(this.props.location);
    return(
      <div>
        <h1>onboarding</h1>
        <RouteTransition pathname={this.props.location.pathname} {...slideLeft} className={style.transitionContainer}>
          {this.props.children}
        </RouteTransition>
      </div>
    );
  }
});