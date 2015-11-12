import React, {PropTypes} from 'react';

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
      showModal: false
    };
  },
  handleHide(){
    if (typeof this.props.onHide === 'function'){
      this.props.onHide.call();
    }else {
      this.setState({showModal: false});
    }
  },
  render(){
    return (
      <Modal show={this.props.show || this.state.showModal} onHide={this.handleHide} className="context" style="default" key="modal">
        <Grid fluid>
          <Row>
            <div className="flex-1">
              <Padding lr={1}>
                <h3>{this.props.title}</h3>
              </Padding>
              {this.props.children}
            </div>
          </Row>
        </Grid>
      </Modal>
    );
  }
});

export default ContextMenu;