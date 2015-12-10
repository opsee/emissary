import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Grid, Row} from '../../modules/bootstrap';
import Modal from './Modal';
import {Padding} from '../layout';
import {app as actions} from '../../reduxactions';

const ContextMenu = React.createClass({
  propTypes: {
    title: PropTypes.string,
    onHide: PropTypes.func,
    children: PropTypes.node,
    id: PropTypes.string.isRequired,
    openId: PropTypes.string,
    actions: PropTypes.shape({
      closeContextMenu: PropTypes.func
    })
  },
  getDefaultProps(){
    return {
      title: 'Menu'
    };
  },
  handleHide(){
    this.props.actions.closeContextMenu();
    if (typeof this.props.onHide === 'function'){
      this.props.onHide.call();
    }
  },
  render(){
    return (
      <Modal show={this.props.openId === this.props.id} onHide={this.handleHide} className="context" style="default" key="modal">
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

const mapStateToProps = (state) => ({
  openId: state.app.openContextMenu
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);