import cx from 'classnames';
import React, { PropTypes } from 'react';

import logoBorderLight from '../../../img/logo-color-border-light.svg';
import logoBorderDark from '../../../img/logo-color-border-dark.svg';
import style from './logoColor.css';

const LogoColor = React.createClass({
  propTypes: {
    className: PropTypes.string,
    borderColor: PropTypes.oneOf(['dark', 'light'])
  },
  getDefaultProps() {
    return {
      borderColor: 'light'
    };
  },
  getImage() {
    return this.props.borderColor === 'light' ? logoBorderLight : logoBorderDark;
  },
  render() {
    return (
      <img src={this.getImage()} alt="Opsee logo" className={cx(style.logo, this.props.className)}/>
    );
  }
});

export default LogoColor;