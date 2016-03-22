import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import * as actions from '../../actions/analytics';

const Analytics = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      trackPageView: PropTypes.func.isRequired
    })
  },
  contextTypes: {
    history: React.PropTypes.object.isRequired
  },
  componentDidMount() {
    this.historyListener = this.context.history.listen((err, renderProps) => {
      if (err || !renderProps) {
        return;
      }

      this.runPageview(renderProps);
    });
  },
  shouldComponentUpdate() {
    return false;
  },
  componentWillUnmount() {
    if (!this.historyListener) {
      return;
    }
    this.historyListener();
    this.historyListener = null;
  },
  runPageview(renderProps) {
    const path = _.chain(renderProps.routes || []).last().get('path').value() || '/';
    if (this.latestUrl === path) {
      return;
    }
    this.latestUrl = path;

    // wait for correct title
    const trackPageView = this.props.actions.trackPageView;
    setTimeout(function wait() {
      trackPageView(path, document.title);
    }, 50);
  },
  render() {
    return null;
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Analytics);
