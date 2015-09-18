import React, {PropTypes} from 'react';
import _ from 'lodash';
React.initializeTouchEvents(true);
import Toggle from './Toggle.jsx';

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
  render(){
    return (
      <div className="display-flex flex-wrap">
        <Toggle on={this.props.on} onChange={this.props.onChange} id={this.props.id} />
        <div className="flex-1">
          <label className="user-select-none padding-tb-sm" onClick={this.props.onChange.bind(null, this.props.id, !this.props.on)} style={{width:'100%'}} htmFor={this.props.id}>
            {this.props.label}
          </label>
        </div>
      </div>
    );
  }
});