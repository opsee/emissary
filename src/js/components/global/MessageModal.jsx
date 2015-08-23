import React, {PropTypes} from 'react';
import {Modal} from 'react-bootstrap';
import GlobalStore from '../../stores/Global';
import GlobalActions from '../../actions/Global';

function getState(){
  return {
    msg:GlobalStore.getModalMessage(),
    showModal:false
  }
}

export default React.createClass({
  mixins: [GlobalStore.mixin],
  storeDidChange() {
    var obj = getState();
    if(obj && obj.msg){
      this.setState({
        msg:obj.msg,
        showModal:true
      });
      GlobalActions.globalModalMessageConsume();
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
        <Modal show={this.state.showModal} onHide={this.close} className="notify">
        {
          // <Modal.Header closeButton>
          //   <Modal.Title>Modal heading</Modal.Title>
          // </Modal.Header>
        }
          <Modal.Body>
            <div dangerouslySetInnerHTML={this.state.msg}/>
          </Modal.Body>
          {
          // <Modal.Footer>
          //   <button className="btn btn-primary" onClick={this.close}>Close</button>
          // </Modal.Footer>
          }
        </Modal>
      </div>
    );
  }
});