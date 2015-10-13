import React, {PropTypes} from 'react';
import Radium from 'radium';
import img from '../../../img/logo-color-border-light.svg';

const LogoColor = React.createClass({
  getStyle(){
    return {
      width: '100px',
      '@media (min-width: 768px)': {
        width: '150px'
      }
    }
  },
  render() {
    return (
       <div className="padding-tb text-center">
         <img src={img} alt="Opsee logo" style={this.getStyle()}/>
       </div>
    );
  }
});

export default Radium(LogoColor);