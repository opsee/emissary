import React, {PropTypes} from 'react';
import Button from './Button.jsx';
import {Close} from '../icons';

export default React.createClass({
  propTypes: {
    bf: PropTypes.object.isRequired
  },
  getInitialState(){
    return {
      data: this.props.bf.value()
    };
  },
  handleChange(){
    let old = this.props.bf.form.cleanedData.DELETE;
    this.props.bf.form.updateData({
      DELETE: !old
    });
  },
  render(){
    return (
      <div className="padding-lr">
        <Button flat icon color="danger" className="pull-right" title="Remove this Header" onClick={this.handleChange}>
          <Close inline fill="danger"/>
        </Button>
      </div>
    );
  }
});