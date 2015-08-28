import React from 'react';
import {Button} from 'react-bootstrap';

export default React.createClass({
  render(){
    return (
      <Button {...this.props} className={this.props.className + (this.props.flat ? ' btn-flat' : '')}>
        {this.props.children}
      </Button>
    )
  }
});