import React, {PropTypes} from 'react';
import RadioWithLabel from './RadioWithLabel.jsx';
import _ from 'lodash';
import Button from './Button.jsx';
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
        <Button flat={true} icon={true} color="danger" className="pull-right" title="Remove this Header" onClick={this.onChange}>
          <Close inline={true} fill="danger"/>
        </Button>
      </div>
    )
  }
});