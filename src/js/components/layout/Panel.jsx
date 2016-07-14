import cx from 'classnames';
import React, { PropTypes } from 'react';
import {connect} from 'react-redux';

import {Padding} from './';
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
      <div className={cx(style.panel, style[this.props.scheme], this.props.className)}>
        <Padding tb={this.props.noPadding ? 0 : 2}>
          {this.props.children}
        </Padding>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(Panel);