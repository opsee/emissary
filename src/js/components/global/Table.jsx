import React, {PropTypes} from 'react';
import style from './table.css';

var Table = React.createClass({
  propTypes:{
    bordered:PropTypes.bool,
    striped:PropTypes.bool
  },
  getTableClass(){
    let c = {};
    if (this.props.bordered && !this.props.striped) {
      c = style.tableBordered;
    } else if (this.props.striped && !this.props.bordered) {
      c = style.tableStriped;
    } else if (this.props.bordered && this.props.striped) {
      c = style.tableBorderedStriped;
    } else {
      c = style.table;
    }
    return c;
  },
  render(){
    return(
      <table className={this.getTableClass()}>
        {this.props.children}
      </table>
    )
  }
})

export default Table;