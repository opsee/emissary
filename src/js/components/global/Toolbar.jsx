import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';
import Radium from 'radium';
import colors from 'seedling/colors';
import DocumentTitle from 'react-document-title';
import {Grid, Row, Col} from '../../modules/bootstrap';
import style from './toolbar.css';

var Toolbar = React.createClass({
  propTypes:{
    title:PropTypes.string.isRequired,
    btnPosition:PropTypes.string,
    bg:PropTypes.string
  },
  outputTitle(){
    return (
      <DocumentTitle title={this.props.documentTitle || this.props.title}/>
    );
  },
  getChildrenClass(){
    let key = this.props.btnPosition || 'default';
    key = _.startCase(key).split(' ').join('');
    return style[`btn${key}`];
  },
  getOuterStyle(){
    let obj = {};
    if(this.props.bg){
      obj.background = colors[this.props.bg];
    }
    return obj;
  },
  render(){
    return(
      <div className={style.outer} style={this.getOuterStyle()}>
        {this.outputTitle()}
        <Grid>
          <Row>
            <Col xs={12} sm={10} smOffset={1} className={style.inner}>
              <h1 className="margin-none">{this.props.title}</h1>
                <div className={this.getChildrenClass()}>
                {this.props.children}
                </div>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
})

export default Radium(Toolbar);