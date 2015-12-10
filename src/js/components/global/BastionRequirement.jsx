import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import StatusHandler from './StatusHandler';
import {Link} from 'react-router';
import _ from 'lodash';

import {Alert} from '../../modules/bootstrap';
import config from '../../modules/config';

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
      })
    })
  },
  getInitialState() {
    return {
      disconnected: false
    };
  },
  componentDidMount() {
    setTimeout(() => {
      if (!this.getFirstMsg()){
        this.setState({
          disconnected: true
        });
      }
    }, 15000);
  },
  getFirstMsg(){
    return _.find(this.props.redux.app.socketMessages, {command: 'bastions'});
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
  renderInner(){
    if (this.state.disconnected){
      return (
        <Alert bsStyle="danger">
          Opsee is having trouble talking to the Bastion.
        </Alert>
      );
    }
    return (
      <Alert bsStyle="danger">
        Bastion is disconnected or has been deleted. If you need to install one, <Link to="/start/region-select" style={{color: 'white', textDecoration: 'underline'}}>click here.</Link>
      </Alert>
    );
  },
  render() {
    if (this.isBastionConnected() || config.skipBastionRequirement){
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