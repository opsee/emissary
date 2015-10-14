import React, {PropTypes} from 'react';
import BaseSVG from './BaseSVG.jsx';
import colors from 'seedling/colors';
import style from './icon.css';

const Icon = React.createClass({
  propTypes:{
    path:PropTypes.string.isRequired
  },
  getClass(){
    if(this.props.btn){
      return style.btn;
    }else if(this.props.inline){
      return style.inline;
    }else if(this.props.nav){
      if(this.props.active){
        return style.navActive;
      }
      return style.nav;
    }
    return '';
  },
  render(){
    return (
      <BaseSVG className={this.getClass()} {...this.props} style={this.props.style}/>
    )
  }
});

export default Icon;