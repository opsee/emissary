import cx from 'classnames';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import style from './rule.css';

const Rule = React.createClass({
  propTypes: {
    scheme: PropTypes.string,
    className: PropTypes.string,
    sm: PropTypes.bool
  },
  render(){
    return <div className={cx(style.rule, style[this.props.scheme], this.props.className)}/>;
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(Rule);