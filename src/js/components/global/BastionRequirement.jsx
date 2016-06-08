import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import StatusHandler from './StatusHandler';
import {Link} from 'react-router';
import _ from 'lodash';

import {Alert} from '../layout';
import config from '../../modules/config';
import {flag} from '../../modules';

const BastionRequirement = React.createClass({
  propTypes: {
    children: PropTypes.node,
    redux: PropTypes.shape({
      app: PropTypes.shape({
        socketMessages: PropTypes.array
      }),
      env: PropTypes.shape({
        bastions: PropTypes.array
      }),
      asyncActions: PropTypes.shape({
        envGetBastions: PropTypes.object
      }),
      user: PropTypes.object
    }),
    // True if a bastion is absolutely required (e.g., for AWS-specific actions),
    // false if it's alright to not have a bastion (e.g., for creating URL checks)
    strict: PropTypes.bool
  },
  getInitialState() {
    return {
      disconnected: false
    };
  },
  componentDidMount() {
    setTimeout(() => {
      if (!this.getFirstMsg()){
        if (this.isMounted()){
          this.setState({
            disconnected: true
          });
        }
      }
    }, 15000);
  },
  getFirstMsg(){
    return _.find(this.props.redux.app.socketMessages, {command: 'bastions'});
  },
  getBastionState(){
    const msg = this.getFirstMsg();
    if (msg && _.get(msg, 'attributes.bastions')){
      const bastion = _.last(msg.attributes.bastions);
      if (bastion && bastion.state){
        return bastion.state;
      }
    }
    return false;
  },
  getStatus(){
    if (this.getFirstMsg() || this.state.disconnected){
      return 'success';
    }
    return 'pending';
  },
  isBastionConnected(){
    return _.chain(this.props.redux.app.socketMessages)
    .filter({command: 'bastions'})
    .find(msg => {
      return _.chain(msg).get('attributes.bastions').find('connected').value();
    })
    .value();
  },
  isConnected(){
    if (!this.props.strict && flag('emissary-allow-no-bastion')) {
      return true;
    }
    return this.isBastionConnected() || config.skipBastionRequirement || !this.props.redux.user.get('id');
  },
  renderReason(){
    const state = this.getBastionState();
    if (state === 'launching'){
      return (
        <div>
          Your Opsee instance is currently installing. You can visit the <Link to="/start/install" style={{color: 'white', textDecoration: 'underline'}}>Install Page</Link> to view progress.
        </div>
      );
    } else if (state === 'active'){
      return (
        <div>
          Your Opsee instance is disconnected or has been removed. If you need to install another, <Link to="/start/launch-stack" style={{color: 'white', textDecoration: 'underline'}}>click here.</Link>
        </div>
      );
    }
    return (
      <div>
        Opsee requires <Link to="/docs/bastion" style={{color: 'white', textDecoration: 'underline'}}>our instance</Link> to be installed. To install one, just <Link to="/start/launch-stack" style={{color: 'white', textDecoration: 'underline'}}>click here.</Link>
      </div>
    );
  },
  renderInner(){
    if (this.state.disconnected && !this.getFirstMsg()){
      return (
        <Alert color="danger">
          Opsee is having trouble communicating with our instance.
        </Alert>
      );
    }
    return (
      <Alert color="danger">
        {this.renderReason()}
      </Alert>
    );
  },
  render() {
    if (this.isConnected()){
      return (
        <div>
          {this.props.children}
        </div>
      );
    }
    return (
      <StatusHandler status={this.getStatus()}>
        {this.renderInner()}
      </StatusHandler>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps)(BastionRequirement);