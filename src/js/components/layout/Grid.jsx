import React, {PropTypes} from 'react';

const Padding = React.createClass({
  propTypes: {
    fluid: PropTypes.bool,
    children: PropTypes.node
  },
  render(){
    return (
      <div className={this.props.fluid ? 'container-fluid' : 'container'}>
        {this.props.children}
      </div>
    );
  }
});

export default Padding;