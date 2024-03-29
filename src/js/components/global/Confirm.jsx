import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/app';
import cx from 'classnames';

import {Button} from '../forms';
import {Close} from '../icons';
import {Padding} from '../layout';
import style from './confirm.css';

const Confirm = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      confirmClose: PropTypes.func
    }),
    scheme: PropTypes.string,
    redux: PropTypes.shape({
      app: PropTypes.shape({
        confirmMessage: PropTypes.shape({
          show: PropTypes.bool,
          color: PropTypes.string,
          html: PropTypes.string,
          confirmText: PropTypes.string,
          onConfirm: PropTypes.func
        })
      })
    })
  },
  componentDidMount(){
    document.getElementById('main').addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onKeydown);
  },
  componentWillUnmount(){
    document.getElementById('main').removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keydown', this.onKeydown);
  },
  onDocumentClick(e){
    const area = ReactDOM.findDOMNode(this.refs.confirm);
    if (area && !area.contains(e.target)) {
      this.props.actions.confirmClose();
    }
  },
  onKeydown(e){
    if (e.keyCode === 27){
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
        <div className={style.curtain} />

        <div ref="confirm" className={cx(style.confirm, style[this.props.scheme])}>
          <div className={style.inner}>
            <div onClick={this.props.actions.confirmClose} className={style.closeButton}>
              <Padding a={2}>
                <Close />
              </Padding>
            </div>

            <div className={style.content}>
              <Padding a={4}>
                <div dangerouslySetInnerHTML={{__html: props.html}} />
                <Padding t={1}>
                  <Button onClick={this.onConfirm} color={props.color} block>{props.confirmText}</Button>
                </Padding>
              </Padding>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state,
  scheme: state.app.scheme
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);