import React, {PropTypes} from 'react';
import {Modal} from '../../modules/bootstrap';
import {GlobalStore} from '../../stores';
import {GlobalActions} from '../../actions';
import colors from 'seedling/colors';

function getState(){
  return {
    options:GlobalStore.getModalMessage(),
    showModal:false
  }
}

export default React.createClass({
  getStyle(){
    return {
      background:this.props.style ? colors[this.props.style] : colors.warning
    }
  },
  getClassName(){
    return this.state.type || 'notify';
  },
  render() {
    return (
      <div>
        <Modal {...this.props}>
        {
        // show={this.state.showModal} onHide={this.close} className={this.getClassName()}
        }
          <Modal.Body style={this.getStyle()}>
            {this.props.children}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
});