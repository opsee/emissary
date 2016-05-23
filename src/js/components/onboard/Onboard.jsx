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
  componentWillMount(){
    if (this.props.location.pathname === '/start/password') {
      const routes = this.state.routes.slice(0);
      routes.unshift('/start/password'); // FIXME
      this.setState({ routes });
    }
  },
  getInitialState(){
    return {
      routes: [
        '/start/launch-stack',
        '/start/launch-instance',
        '/start/install-example',
        '/start/notifications',
        '/start/postinstall'
      ]
    };
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
    const route = this.props.location.pathname;
    const activePip = this.state.routes.indexOf(route);
    if (activePip < 0) {
      return null;
    }
    return _.times(this.state.routes.length, i => {
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