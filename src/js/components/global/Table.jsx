import React, {PropTypes} from 'react';
import style from './table.css';

var Table = React.createClass({
  propTypes:{
    bordered:PropTypes.bool,
    striped:PropTypes.bool
  },
  // outputTableHead(){
  //   let key = this.props.btnPosition || 'default';
  //   key = _.startCase(key).split(' ').join('');
  //   return style[`btn${key}`];
  // },
  // getOuterClass(){
  //   let c = {};
  //   if(this.props.bg == "info"){
  //     c = style.outerInfo;
  //   } else {
  //     c = style.outer;
  //   }
  //   return c;
  // },
  // getOuterStyle(){
  //   let obj = {};
  //   if(this.props.bg){
  //     obj.background = colors[this.props.bg];
  //   }
  //   return obj;
  // },
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