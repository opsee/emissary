import React, {PropTypes} from 'react';
import _ from 'lodash';
React.initializeTouchEvents(true);
import Radio from './Radio.jsx';
import colors from 'seedling/colors';

const RadioWithLabel = React.createClass({
  propTypes: {
    on: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    label: PropTypes.string.isRequired
  },
  getStyle(){
    let style = {
       marginTop: '0.1em'
    }
    if (this.props.on){
      style.color = colors.primary;
    }
    return style;
  },
  render(){
    return (
      <div className="display-flex">
        <Radio on={this.props.on} onChange={this.props.onChange} id={this.props.id} />
        <div className="flex-1">
          <label className={`label user-select-none padding-tb-sm`} style={[this.getStyle(), this.props.labelStyle]} htmlFor={this.props.id}>
            {this.props.label}
          </label>
        </div>
      </div>
    );
  }
});

export default RadioWithLabel;