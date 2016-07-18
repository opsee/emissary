import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import style from './alert.css';
import cx from 'classnames';

const Alert = React.createClass({
  propTypes: {
    color: PropTypes.string,
    onDismiss: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    scheme: PropTypes.string
  },
  getDefaultProps() {
    return {
      color: 'default'
    };
  },
  getClass(){
    return cx([
      style.alert,
      style[this.props.color],
      'display-flex',
      this.props.className,
      style[this.props.scheme]
    ]);
  },
  renderDismissButton(){
    if (this.props.onDismiss){
      return <button type="button" className={style.dismiss} onClick={this.props.onDismiss}>×</button>;
    }
    return null;
  },
  render(){
    return (
      <div className={this.getClass()} style={this.props.style}>
        <div className="flex-1">
          {this.props.children}
        </div>
        {this.renderDismissButton()}
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(Alert);