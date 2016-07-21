import React, {PropTypes} from 'react';
import cx from 'classnames';
import {connect} from 'react-redux';

import style from './table.css';

const Table = React.createClass({
  propTypes: {
    bordered: PropTypes.bool,
    striped: PropTypes.bool,
    children: PropTypes.node,
    scheme: PropTypes.string
  },
  getTableClass(){
    return cx(style.table, style[this.props.scheme]);
  },
  render(){
    return (
      <table className={this.getTableClass()}>
        <tbody>
          {this.props.children}
        </tbody>
      </table>
    );
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(Table);