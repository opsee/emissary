import React, {PropTypes} from 'react';
import _ from 'lodash';
import cx from 'classnames';
import {plain as seed} from 'seedling';
import style from './progressBar.css';

export default React.createClass({
  propTypes: {
    percentage: PropTypes.number.isRequired,
    color: PropTypes.string,
    steps: PropTypes.number,
    flat: PropTypes.bool
  },
  getDefaultProps(){
    return {
      flat: false
    };
  },
  getBg(){
    if (this.props.color) {
      return this.props.color;
    }
    const {color} = seed;
    if (this.props.percentage >= 100){
      return color.success;
    } else if (this.props.percentage === 0){
      return color.warning;
    } else if (this.props.percentage === -1){
      return color.danger;
    }
    return color.primary;
  },
  getClass(){
    return cx(style.progress, {
      [style.progressFlat]: this.props.flat
    });
  },
  getWidth(){
    if (this.props.percentage === 0 || this.props.percentage === -1){
      return 100;
    }
    return this.props.percentage;
  },
  renderTicks(){
    return (
      <div className={style.ticks}>
        {_.range(this.props.steps - 1).map(i => {
          return (
            <div className={style.tick} style={{margin: `0 ${100 / this.props.steps / 2}%`}} key={`progress-bar-${i}`}/>
          );
        })}
      </div>
    );
  },
  render() {
    return (
     <div className={this.getClass()}>
        <div className={style.bar} style={{width: `${this.getWidth()}%`, background: this.getBg()}}></div>
        {!!this.props.steps ? this.renderTicks() : null}
      </div>
    );
  }
});