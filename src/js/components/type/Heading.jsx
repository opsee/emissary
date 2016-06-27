import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import cx from 'classnames';

import style from './heading.css';
import {Padding} from '../layout';

const Heading = React.createClass({
  propTypes: {
    children: PropTypes.node,
    level: PropTypes.oneOf([1, 2, 3, 4, 5]),
    style: PropTypes.object,
    noPadding: PropTypes.bool,
    className: PropTypes.string,
    scheme: PropTypes.string
  },
  getDefaultProps() {
    return {
      level: 1,
      style: {}
    };
  },
  getPadding(){
    let padding = this.props.level < 4 ? 2 : 1;
    if (this.props.noPadding){
      padding = 0;
    }
    return {
      b: padding
    };
  },
  render(){
    const string = `h${this.props.level}`;
    const className = cx([this.props.className, style[string], style[this.props.scheme]]);
    const props = _.assign({}, this.props, {className});
    return (
      <Padding {...this.getPadding()} className={this.props.className}>
        {
          React.createElement(string, props, this.props.children)
        }
      </Padding>
    );
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(Heading);