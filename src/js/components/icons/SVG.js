import React from 'react';
import BaseSVG from './BaseSVG.jsx';
import colors from 'seedling/colors';

function SVG(path){
  return React.createClass({
    generateStyle(){
      let style;
      if(this.props.btn){
        style = {
          position:'absolute',
          left:'50%',
          top:'50%',
          margin:'-12px 0 0 -12px'
        }
      }else if(this.props.inline){
        style = {
          display:'inline-block',
          height:'1.3em',
          width:'1.3em',
          verticalAlign:'text-bottom'
        }
      }else if(this.props.nav){
        style = {
          display:'inline-block',
          height:'18px',
          width:'18px',
          verticalAlign:'text-bottom',
        }
      }
      return this.props.style || style;
    },
    getFill(){
      if(this.props.nav && this.props.active){
        return 'white';
      }else if(this.props.nav){
        return 'rgba(255, 255, 255, 0.54)';
      }
      return this.props.fill || 'white';
    },
    render(){
      return (
        <BaseSVG path={path} {...this.props} style={this.generateStyle()} fill={this.getFill()}/>
      )
    }
  });
}

export default SVG;