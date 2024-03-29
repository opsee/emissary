import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import style from './icon.css';
import cx from 'classnames';
import _ from 'lodash';

import BaseSVG from './BaseSVG.jsx';

const Icon = React.createClass({
  propTypes: {
    path: PropTypes.string,
    //fill is either a named opsee color, or any css color
    fill: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    scheme: PropTypes.string,
    viewBox: PropTypes.string,
    children: PropTypes.node
  },
  getColorClassFromProp(prop){
    const cased = _.startCase(this.props[prop]).split(' ').join('');
    return cx(style[`fill${cased}`], style[this.props.scheme]);
  },
  getClass(){
    let arr = [];
    for (const prop in this.props){
      if (prop === 'fill'){
        arr.push(this.getColorClassFromProp(prop));
      } else {
        arr.push(style[prop]);
      }
    }
    arr.push(this.props.className);
    if (!this.props.fill){
      arr.push(style[this.props.scheme]);
    }
    return cx(arr);
  },
  getFill(){
    const colorClass = this.getColorClassFromProp('fill');
    return !colorClass || this.props.fill || 'text';
  },
  getProps(){
    return _.omit(_.assign({}, this.props, {
      className: this.getClass(),
      fill: this.getFill()
    }), ['children']);
  },
  render(){
    return (
      <BaseSVG {...this.getProps()}>
        {this.props.children}
      </BaseSVG>
    );
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(Icon);