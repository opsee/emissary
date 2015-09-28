import React, {PropTypes} from 'react';

export default React.createClass({
  propTypes:{
    bf:PropTypes.object.isRequired
  },
  errors(){
    const errors = this.props.bf && this.props.bf.errors().messages().map((message, i) => {
      return(
        <div key={i}>
          {message}
        </div>
      )
    });
    if(!errors || !this.props.bf.label){
      return(
        <div>
          Bad input params.
        </div>
      )
    }else{
      return errors;
    }
  },
  renderChildren(){
    if(this.props.children){
      return(
        <div style={{marginRight:'0.7em'}}>
          {this.props.children}
        </div>
      );
    }
  },
  render(){
    return(
      <label className="flex-order-1" htmlFor={this.props.bf.idForLabel()}>
        <span className="form-label">{this.props.bf.label}</span>
        <span className="form-message">
          {this.errors()}
        </span>
      </label>
    )
  }
});