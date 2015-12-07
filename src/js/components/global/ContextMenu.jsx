import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Grid, Row} from '../../modules/bootstrap';
import Modal from './Modal';
import {Padding} from '../layout';

const ContextMenu = React.createClass({
  propTypes: {
    title: PropTypes.string,
    onHide: PropTypes.func,
    show: PropTypes.bool,
    children: PropTypes.node
  },
  getDefaultProps(){
    return {
      title: 'Menu'
    };
  },
  getInitialState(){
    return {
      show: !!(this.props.show)
    };
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      show: nextProps.show
    });
  },
  getChildren(){
    return React.cloneElement(this.props.children, _.assign({},
      {
        onClick: this.handleButtonClick
      })
    );
  },
  handleButtonClick(){
    this.setState({
      show: false
    });
  },
  handleHide(){
    if (typeof this.props.onHide === 'function'){
      this.props.onHide.call();
    }
    this.setState({show: false});
  },
  render(){
    return (
      <Modal show={this.state.show} onHide={this.handleHide} className="context" style="default" key="modal">
        <Grid fluid>
          <Row>
            <div className="flex-1">
              <Padding lr={1}>
                <h3>{this.props.title}</h3>
              </Padding>
              {this.getChildren()}
              {
                // this.props.children
              }
            </div>
          </Row>
        </Grid>
      </Modal>
    );
  }
});

export default ContextMenu;