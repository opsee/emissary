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
  }
  shouldComponentUpdate(props, state) {
    if (!config.ghosting) {
      this.runPageview();
    }
    return false;
  }
  runPageview() {
    const path = this.props.location;
    console.log(path);
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
