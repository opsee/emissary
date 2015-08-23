import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';
import Radium from 'radium';
import colors from 'seedling/colors';


var outer = {
  // backgroundColor:colors.gray900,
}

var Alert = React.createClass({
  getOuterStyle(){
    let style;
    switch(this.props.type){
      case 'danger':
        style = {
          backgroundColor:colors.danger,
          color:'white'
        }
      break;
    }
    return style;
  },
  render(){
    return(
      <div className="container-fluid" style={this.getOuterStyle()}>
        <div className="row">
          <div className="col-xs-12 padding-tb">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
})

export default Radium(Alert);