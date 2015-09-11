import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';
import Radium from 'radium';
import colors from 'seedling/colors';
import {Grid, Row, Col} from '../../modules/bootstrap';

var Alert = React.createClass({
  getOuterStyle(){
    let style = {
      backgroundColor:colors.danger,
      color:'white'
    };
    if(this.props.type){
      style.backgroundColor = colors[this.props.type];
    }
    return style;
  },
  render(){
    return(
      <Grid fluid={true} style={this.getOuterStyle()}>
        <Row>
          <Col xs={12} className="padding-tb">
            {this.props.children}
          </Col>
        </Row>
      </Grid>
    )
  }
})

export default Radium(Alert);