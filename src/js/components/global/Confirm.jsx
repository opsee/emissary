import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/app';
import style from './confirm.css';

const Confirm = React.createClass({
  propTypes: {
    html: PropTypes.string,
    type: PropTypes.oneOf(['info', 'success', 'warning', 'danger']),
    color: PropTypes.string,
    confirmText: PropTypes.string,
    dismissText: PropTypes.string,
    onConfirm: PropTypes.func,
    onDismiss: PropTypes.func
  },
  componentDidMount(){
    document.getElementById('main').addEventListener('click', this.onDocumentClick);
  },
  componentWillUnmount(){
    document.getElementById('main').removeEventListener('click', this.onDocumentClick);
  },
  onDocumentClick(e){
    const area = ReactDOM.findDOMNode(this.refs.confirm);
    if (!area.contains(e.target)) {
      this.props.actions.confirmClose();
    }
  },
  render() {
    if (!this.props.redux.app.confirmMessage.show) {
      return null;
    }
    return (
      <div>
        <div className={style.curtain}>
        </div>
        <div ref="confirm" className={style.confirm}>
          confirmation
        </div>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);