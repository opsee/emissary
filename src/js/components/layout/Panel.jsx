import cx from 'classnames';
import React, { PropTypes } from 'react';
import {connect} from 'react-redux';

import style from './panel.css';

const Panel = React.createClass({
  propTypes: {
    scheme: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    noPadding: PropTypes.bool
  },
  render() {
    return (
      <div className={cx(style.panel, style[this.props.scheme], this.props.className, this.props.noPadding && style.noPadding)}>
        {this.props.children}
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(Panel);