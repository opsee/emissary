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
    this.historyListener = this.context.history.listen(location => {
      if (!location) {
        return;
      }
      this.runPageview(location);
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
  runPageview(location) {
    // wait for correct title
    const trackPageView = this.props.actions.trackPageView;
    setTimeout(function wait() {
      trackPageView(_.get(location, 'pathname'), document.title);
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
