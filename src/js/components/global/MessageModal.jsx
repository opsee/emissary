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
  mixins: [GlobalStore.mixin],
  storeDidChange() {
    var obj = getState();
    if(obj && obj.options){
      this.setState({
        msg:{
          __html:obj.options.html
        },
        showModal:true,
        style:obj.options.style
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
  getStyle(){
    return {
      background:this.state.style ? colors[this.state.style] : colors.warning
    }
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
          <Modal.Body style={this.getStyle()}>
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