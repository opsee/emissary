import React from 'react';
import {Modal} from '../../modules/bootstrap';
import {GlobalStore} from '../../stores';
import {GlobalActions} from '../../actions';
import colors from 'seedling/colors';

function getState(){
  return {
    options: GlobalStore.getModalMessage(),
    showModal: false
  };
}

export default React.createClass({
  mixins: [GlobalStore.mixin],
  storeDidChange() {
    const obj = getState();
    if (obj && obj.options){
      this.setState({
        msg: {
          __html: obj.options.html
        },
        showModal: true,
        style: obj.options.style,
        type: obj.options.type
      });
      GlobalActions.globalModalMessageConsume();
    }
  },
  getInitialState: getState,
  getStyle(){
    return {
      background: this.state.style ? colors[this.state.style] : colors.warning
    };
  },
  getClassName(){
    return this.state.type || 'notify';
  },
  handleHide(){
    this.setState({ showModal: false });
  },
  render() {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.handleHide} className={this.getClassName()}>
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
          //   <button className="btn btn-primary" onClick={this.handleHide}>Close</button>
          // </Modal.Footer>
          }
        </Modal>
      </div>
    );
  }
});