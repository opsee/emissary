import _ from 'lodash';
import cx from 'classnames';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { History } from 'react-router';

import { Circle } from '../icons';
import { Padding } from '../layout';
import { app as actions } from '../../actions';
import style from './onboard.css';

const Onboard = React.createClass({
  mixins: [History],
  propTypes: {
    location: PropTypes.shape({
      pathname: PropTypes.string
    }),
    history: PropTypes.shape({
      pushState: PropTypes.func
    }),
    actions: PropTypes.shape({
      confirmOpen: PropTypes.func
    }),
    children: PropTypes.node
  },
  getInitialState(){
    return {
      numPips: 4
    };
  },
  getActivePip(){
    switch (this.props.location.pathname) {
    case 'start/launch-stack':
      return 0;
    case '/start/launch-instance':
    case '/start/install':
    case '/start/install-example':
      return 1;
    case '/start/notifications':
      return 2;
    case '/start/postinstall':
      return 3;
    default:
      return -1;
    }
  },
  isInstalling(){
    const pathname = this.props.location.pathname;
    return pathname === '/start/install' || pathname === '/start/install-example';
  },
  onClose(){
    if (this.isInstalling()) {
      this.history.pushState(null, '/');
    } else {
      this.props.actions.confirmOpen({
        html: '<p>Are you sure you want to cancel installation? You can come back at any time.</p>',
        confirmText: 'Yes, cancel',
        color: 'danger',
        onConfirm: this.props.history.pushState.bind(null, null, '/')
      });
    }
  },
  renderPips(){
    const activePip = this.getActivePip();
    if (activePip < 0) {
      return null;
    }
    return _.times(this.state.numPips, i => {
      const className = cx(style.pip, {[style.activePip]: i === activePip});
      return (
        <Circle key={i} className={className} />
      );
    });
  },
  render(){
    return (
      <div className={style.container}>
        <Padding className={style.pips}>
          {this.renderPips()}
        </Padding>
        <Padding t={1}>
          {this.props.children}
        </Padding>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(Onboard);