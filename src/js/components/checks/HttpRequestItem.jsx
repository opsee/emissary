import React, {PropTypes} from 'react';

import {Alert} from '../../modules/bootstrap';

export default React.createClass({
  propTypes: {
    spec: PropTypes.object.isRequired,
    target: PropTypes.object.isRequired
  },
  render() {
    const {spec, target} = this.props;
    const targetLabel = target.name || target.id;

    return (
      <Alert bsStyle="default" style={{wordBreak: 'break-all'}}>
        <strong>{spec.verb}</strong> {spec.protocol}://{targetLabel}:{spec.port}{spec.path}
      </Alert>
    );
  }
});
