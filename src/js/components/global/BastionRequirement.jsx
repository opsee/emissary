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
      env: PropTypes.shape({
        bastions: PropTypes.array
      }),
      asyncActions: PropTypes.shape({
        envGetBastions: PropTypes.object
      })
    })
  },
  render() {
    if (_.find(this.props.redux.env.bastions, 'connected') || config.skipBastionRequirement){
      return (
        <div>
          {this.props.children}
        </div>
      );
    }
    return (
      <StatusHandler status={this.props.redux.asyncActions.envGetBastions.status}>
        <Alert bsStyle="danger">
          Bastion is disconnected or has been deleted. If you need to install one, <Link to="/start/region-select" style={{color: 'white', textDecoration: 'underline'}}>click here.</Link>
        </Alert>
      </StatusHandler>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

export default connect(mapStateToProps)(BastionRequirement);