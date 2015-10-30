import React, {PropTypes} from 'react';
import DocumentTitle from 'react-document-title';
import {Grid, Row, Col} from '../../modules/bootstrap';
import style from './toolbar.css';

const Toolbar = React.createClass({
  propTypes: {
    title: PropTypes.string.isRequired,
    btnPosition: PropTypes.string,
    bg: PropTypes.string,
    children: PropTypes.node
  },
  getChildrenClass(){
    let key = this.props.btnPosition || 'default';
    key = _.startCase(key).split(' ').join('');
    return style[`btn${key}`];
  },
  getOuterClass(){
    let c = {};
    if (this.props.bg === 'info'){
      c = style.outerInfo;
    } else {
      c = style.outer;
    }
    return c;
  },
  getOuterStyle(){
    let obj = {};
    if (this.props.bg){
      obj.background = colors[this.props.bg];
    }
    return obj;
  },
  renderTitle(){
    return (
      <DocumentTitle title={this.props.title}/>
    );
  },
  render(){
    return (
      <div className={this.getOuterClass()}>
        {this.renderTitle()}
        <Grid>
          <Row>
            <Col xs={12} className={style.inner}>
              <h1 style={{margin: 0}}>{this.props.title}</h1>
                <div className={this.getChildrenClass()}>
                {this.props.children}
                </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

export default Toolbar;