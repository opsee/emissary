import React, {PropTypes} from 'react';
import Label from './Label.jsx';
import cx from 'classnames';

const InputWithLabel = React.createClass({
  propTypes: {
    children: PropTypes.node,
    bf: PropTypes.object.isRequired
  },
  render(){
    let arr = ['flex-column'];
    if (this.props.children) {
      arr.push('has-icon');
    }
    return (
      <div className={cx(arr)}>
        <div className="input-container flex-order-2">{this.props.bf.render()}</div>
        <Label className="flex-order-1" bf={this.props.bf} />
        {this.props.children}
      </div>
    );
  }
});

export default InputWithLabel;