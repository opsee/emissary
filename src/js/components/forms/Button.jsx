import React from 'react';
import {Button} from '../../modules/bootstrap';
import {ChevronRight} from '../icons';
import colors from 'seedling/colors';

export default React.createClass({
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
  render(){
    return (
      <Button {...this.props} className={this.props.className + (this.props.flat ? ' btn-flat' : '')}>
        {this.props.children}
        {this.renderChevron()}
      </Button>
    )
  }
});