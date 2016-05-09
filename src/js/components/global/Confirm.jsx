import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/app';

import {Button} from '../forms';
import {Padding} from '../layout';
import style from './confirm.css';

const Confirm = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      confirmClose: PropTypes.func
    }),
    redux: PropTypes.shape({
      app: PropTypes.shape({
        confirmMessage: PropTypes.shape({
          show: PropTypes.bool,
          color: PropTypes.string,
          html: PropTypes.string,
          confirmText: PropTypes.string,
          dismissText: PropTypes.string,
          onConfirm: PropTypes.func,
          onDismiss: PropTypes.func
        })
      })
    })
  },
  componentDidMount(){
    document.getElementById('main').addEventListener('click', this.onDocumentClick);
  },
  componentWillUnmount(){
    document.getElementById('main').removeEventListener('click', this.onDocumentClick);
  },
  onDocumentClick(e){
    const area = ReactDOM.findDOMNode(this.refs.confirm);
    if (area && !area.contains(e.target)) {
      this.props.actions.confirmClose();
    }
  },
  onConfirm(){
    this.props.redux.app.confirmMessage.onConfirm();
    this.props.actions.confirmClose();
  },
  render() {
    const props = this.props.redux.app.confirmMessage;
    if (!props.show) {
      return null;
    }
    return (
      <div>
        <div className={style.curtain}>
        </div>
        <div ref="confirm" className={style.confirm}>
          <Padding a={2}>
            <div dangerouslySetInnerHTML={{__html: props.html}} />
            <Padding t={1}>
              <Button onClick={this.onConfirm} color={props.color}>{props.confirmText || 'confirm'}</Button>
            </Padding>
          </Padding>
        </div>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);