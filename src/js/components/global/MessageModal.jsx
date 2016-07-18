import React, {PropTypes} from 'react';
import {plain as seed} from 'seedling';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {Modal} from '../layout';
import {app as actions} from '../../actions';

const MessageModal = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      modalMessageClose: PropTypes.func
    }),
    obj: PropTypes.shape({
      html: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
      ]),
      color: PropTypes.object,
      show: PropTypes.bool
    })
  },
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props.obj, nextState.obj);
  },
  getStyle(){
    const color = this.props.obj.color;
    return {
      background: color ? seed.color[color] : seed.color.warning
    };
  },
  handleHide(){
    this.props.actions.modalMessageClose();
  },
  render() {
    return (
      <div>
        <Modal show={!!this.props.obj.show} onHide={this.handleHide} className="notify">
          <Modal.Body style={this.getStyle()}>
            <div dangerouslySetInnerHTML={{__html: this.props.obj.html}}/>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  obj: state.app.modalMessage
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageModal);