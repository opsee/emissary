import React, {PropTypes} from 'react';
import _ from 'lodash';
import cx from 'classnames';
import DocumentTitle from 'react-document-title';
import {plain as seed} from 'seedling';

import {Col, Grid, Row} from '../layout';
import style from './toolbar.css';
import {Heading, Hyphenate} from '../type';
import {scheme} from '../../modules';

const Toolbar = React.createClass({
  propTypes: {
    title: PropTypes.string.isRequired,
    btnPosition: PropTypes.string,
    bg: PropTypes.string,
    children: PropTypes.node,
    pageTitle: PropTypes.string,
    className: PropTypes.string
  },
  getChildrenClass(){
    let key = this.props.btnPosition || 'default';
    key = _.startCase(key).split(' ').join('');
    return style[`btn${key}`];
  },
  getStyle(){
    let obj = {};
    if (this.props.bg){
      obj.background = seed.color[this.props.bg];
    }
    return obj;
  },
  renderTitle(){
    return (
      <DocumentTitle title={this.props.pageTitle || this.props.title}/>
    );
  },
  render(){
    return (
      <div className={cx(style.outer, this.props.className, style[scheme()])} style={this.getStyle()}>
        {this.renderTitle()}
        <Grid>
          <Row>
            <Col xs={12} className={style.inner}>
              <Heading level={1} noPadding>
                <Hyphenate>{this.props.title}</Hyphenate>
              </Heading>
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