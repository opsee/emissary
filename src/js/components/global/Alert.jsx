import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';
import colors from 'seedling/colors';
import {Alert, Grid, Row, Col} from '../../modules/bootstrap';

var OpseeAlert = React.createClass({
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
    return (
      <Alert bsStyle={this.props.type}>
      </Alert>
    );
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

export default OpseeAlert;