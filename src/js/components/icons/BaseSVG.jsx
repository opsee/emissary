import React, {PropTypes} from 'react';
import _ from 'lodash';

const BaseSVG = React.createClass({
  propTypes: {
    children: PropTypes.node
  },
  getInitialState(){
    return this.getState();
  },
  componentWillReceiveProps(newProps){
    this.setState(this.getState(newProps));
  },
  getState(props){
    const data = props || this.props;
    let width = data.width || 24;
    let height = data.height || 24;
    return {
      width: width,
      height: height,
      fill: data.fill || 'white',
      path: data.path || '',
      viewBox: data.viewBox || [0, 0, width, height].join(' '),
      style: data.style || {},
      className: data.className,
      title: data.title
    };
  },
  render() {
    return (
      <svg {..._.omit(this.state, ['path'])}>
        {this.props.children ? this.props.children : <path d={this.state.path} />}
      </svg>
    );
  }
});

export default BaseSVG;