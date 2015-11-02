import React from 'react';

const BaseSVG = React.createClass({
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
      className: data.className
    };
  },
  render() {
    return (
      <svg xmlns="http://www.w3.org/svg/2000"
        viewBox={this.state.viewBox}
        width={this.state.width}
        height={this.state.height}
        fill={this.state.fill}
        style={this.state.style}
        className={this.state.className}
        >
        <path d={this.state.path} />
      </svg>
    );
  }
});

export default BaseSVG;