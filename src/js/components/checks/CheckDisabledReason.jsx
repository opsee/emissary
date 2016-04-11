import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Alert, Padding} from '../layout';
import {validate} from '../../modules';

const CheckDisabledReason = React.createClass({
  propTypes: {
    check: PropTypes.object.isRequired,
    areas: PropTypes.array
  },
  getDefaultProps() {
    return {
      areas: ['request', 'assertions', 'info', 'notifications']
    };
  },
  render() {
    const errors = validate.check(this.props.check, this.props.areas);
    if (errors.length){
      return (
        <Padding t={1}>
          <Alert color="default">{_.head(errors).error}</Alert>
        </Padding>
      );
    }
    return <div/>;
  }
});

export default CheckDisabledReason;