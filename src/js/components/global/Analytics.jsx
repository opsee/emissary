import React, { Component } from 'react';
import config from '../../modules/config';

export default class GoogleAnalytics extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired
  };
  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };
  /*eslint-disable react/no-did-mount-set-state*/
  componentDidMount() {
    if (!window.ga){
      console.error('No ga script found');
    }
    this.setState({
      isReady: true
    });
  }
  shouldComponentUpdate(props, state) {
    if (state.isReady && !config.ghosting) {
      this.runPageview();
    }
    return false;
  }
  runPageview() {
    if (!this.context.router) {
      throw new Error('Router is not presented in the component context.');
    }
    const path = this.context.router.getCurrentPath();
    if (this.latestUrl === path) {
      return;
    }
    this.latestUrl = path;
    //wait for correct title
    setTimeout(() => {
      GoogleAnalytics.sendPageview(path, document.title);
      window.Intercom('update');
    }, 0);
  }
  render() {
    return null;
  }
  static command(...args) {
    if (!window.ga) {
      throw new Error('Google analytics is not initialized');
    }
    return window.ga.apply(window.ga, args);
  }
  static send(what, options) {
    return GoogleAnalytics.command('send', what, options);
  }
  static sendPageview(page, title = page) {
    return GoogleAnalytics.send('pageview', { page, title });
  }
}
