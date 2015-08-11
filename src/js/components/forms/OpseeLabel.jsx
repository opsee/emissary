import React from 'react';

export default React.createClass({
  errors(){
    const errors = this.props.bf && this.props.bf.errors().messages().map(message => {
      return(
        <div>
          {message}
        </div>
      )
    });
    if(!errors || !this.props.label){
      return(
        <div>
          Bad input params.
        </div>
      )
    }else{
      return errors;
    }
  },
  render(){
    return(
      <label htmlFor={this.props.id}>
        <span className="form-label">{this.props.label}</span>
        <span className="form-message">
          {this.errors()}
        </span>
      </label>
    )
  }
});