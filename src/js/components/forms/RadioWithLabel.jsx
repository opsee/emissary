import React, {PropTypes} from 'react';
import _ from 'lodash';
React.initializeTouchEvents(true);
import Radio from './Radio.jsx';
import colors from 'seedling/colors';

export default React.createClass({
  propTypes:{
    on:PropTypes.bool.isRequired,
    onChange:PropTypes.func.isRequired,
    id:PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label:PropTypes.string.isRequired
  },
  getStyle(){
    let style = {};
    if(this.props.on){
      style.color = colors.primary;
    }
    return style;
  },
  render(){
    return (
      <div className="display-flex flex-wrap">
        <Radio on={this.props.on} onChange={this.props.onChange} id={this.props.id} />
        <div className="flex-1">
          <label className={`user-select-none padding-tb-sm`} style={this.getStyle()} htmlFor={this.props.id}>
            {this.props.label}
          </label>
        </div>
      </div>
    );
  }
});