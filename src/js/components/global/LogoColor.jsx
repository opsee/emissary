import React from 'react';
import img from '../../../img/logo-color-border-light.svg';
import style from './logoColor.css';

const LogoColor = React.createClass({
  render() {
    return (
       <div className="padding-tb text-center">
         <img src={img} alt="Opsee logo" className={style.logo}/>
       </div>
    );
  }
});

export default LogoColor;