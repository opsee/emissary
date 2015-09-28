import React, {PropTypes} from 'react';
import RadioWithLabel from './RadioWithLabel.jsx';
import _ from 'lodash';
import {Close} from '../icons';

export default React.createClass({
  propTypes:{
    bf:PropTypes.object.isRequired
  },
  getInitialState(){
    return {
      data:this.props.bf.value()
    };
  },
  onChange(id, bool){
    let old = this.props.bf.form.cleanedData.DELETE;
    this.props.bf.form.updateData({
      DELETE:!old
    });
  },
  render(){
    return(
      <div className="padding-lr">
        <button type="button" className="btn btn-icon btn-flat" title="Remove this Header" onClick={this.onChange}>
          <Close btn={true}/>
        </button>
      </div>
    )
  }
});