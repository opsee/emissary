import React from 'react';
import {Button} from '../../modules/bootstrap';
import {ChevronRight} from '../icons';
import colors from 'seedling/colors';
import Radium from 'radium';
import {Link} from 'react-router';

const OpseeButton = React.createClass({
  getDefaultProps(){
    return {
      className:''
    }
  },
  renderChevron(){
    if(this.props.chevron){
      let fill = 'white';
      if(this.props.disabled){
        fill = colors.textColorSecondary;
      }
      return <ChevronRight inline={true} fill={fill}/>
    }
  },
  getStyle(){
    let obj = this.props.style || {};
    if(this.props.noPad){
      obj = {
        borderRadius:0,
        paddingLeft:0,
        paddingRight:0
      }
    }
    return obj;
  },
  getFlat(){
    return this.props.flat ? ' btn-flat' : ''
  },
  getIcon(){
    return this.props.icon ? ' btn-icon' : ''
  },
  render(){
    if(!this.props.to){
      return (
        <Button {...this.props} className={this.props.className + this.getFlat() + this.getIcon()} style={this.getStyle()}>
          {this.props.children}
          {this.renderChevron()}
        </Button>
      )
    }else{
      return (
        <Link className={`btn ${this.props.className}${this.getFlat()}${this.getIcon()}`} style={this.getStyle()} to={this.props.to} params={this.props.params}>
          {this.props.children}
          {this.renderChevron()}
        </Link>
      )
    }
  }
});

export default Radium(OpseeButton);