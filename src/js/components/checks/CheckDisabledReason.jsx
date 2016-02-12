import React, {PropTypes} from 'react';
import _ from 'lodash';

import {Padding} from '../layout';
import {Alert} from '../../modules/bootstrap';
import {validateCheck} from '../../modules';

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
    const errors = validateCheck(this.props.check, this.props.areas);
    if (errors.length){
      return (
        <Padding t={1}>
          <Alert bsStyle="default">{_.head(errors).error}</Alert>
        </Padding>
      );
    }
    return <div/>;
  }
});

export default CheckDisabledReason;