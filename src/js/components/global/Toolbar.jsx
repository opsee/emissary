import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';
import Radium from 'radium';
import colors from 'seedling/colors';
import DocumentTitle from 'react-document-title';

var outer = {
  backgroundColor:colors.gray900,
  fontSize:'2.0rem',
  width:'100%',
  marginBottom:'2em'
}

var inner = {
  paddingTop:'1em',
  paddingBottom:'1.2em',
  position:'relative'
  // @include breakpoint($screen-sm){
  //   paddingTop:'1.5em'
  //   paddingBottom:'1.7em'
  // }
}

var btnPositions = {
  default:{
    position:'absolute',
    bottom:'-1.4em',
    right:'0.6em'
  },
  midRight:{
    position:'absolute',
    top:'50%',
    marginTop:'-24px',
    right:'0.6em'
  }
}


var Toolbar = React.createClass({
  propTypes:{
    title:PropTypes.string.isRequired
  },
  outputTitle(){
    return (
      <DocumentTitle title={this.props.documentTitle || this.props.title}/>
    );
  },
  render(){
    var childStyle = this.props.btnPosition ? btnPositions[this.props.btnPosition] : btnPositions.default;
    return(
      <div style={outer}>
        {this.outputTitle()}
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1" style={inner}>
              <h1 className="margin-none">{this.props.title}</h1>
                <div style={childStyle}>
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default Radium(Toolbar);