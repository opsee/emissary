import React, {PropTypes} from 'react';
import {Modal} from 'react-bootstrap';
import Store from '../../stores/Global';

function getState(){
  return {
    msg:Store.getModalMessage(),
    showModal:false
  }
}

export default React.createClass({
  mixins: [Store.mixin],
  storeDidChange() {
    var obj = getState();
    if(this.state.msg != obj.msg){
      this.setState({
        msg:obj.msg,
        showModal:true
      })
    }
  },
  getInitialState:getState,
  close(){
    this.setState({ showModal: false });
  },
  open(){
    this.setState({ showModal: true });
  },
  render() {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.state.msg}</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary" onClick={this.close}>Close</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});