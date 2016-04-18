import _ from 'lodash';
import React, { PropTypes } from 'react';

import MetricGraph from '../global/MetricGraph';
import {Color, Heading} from '../type';
import rdsMetrics from '../../modules/rdsMetrics';

export default React.createClass({
  propTypes: {
    metric: PropTypes.oneOf(_.keys(rdsMetrics)).isRequired,

    data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      unit: PropTypes.string,
      value: PropTypes.number.isRequired
    })).isRequired,

    relationship: PropTypes.oneOf(['lessThan', 'greaterThan']).isRequired,
  },

  getMetricMeta() {
    const meta = _.get(rdsMetrics, this.props.metric, {});
    return _.assign({}, meta, {
      name: this.props.metric
    });
  },

  render() {
    const meta = this.getMetricMeta();
    console.log(this.props);

    return (
      <div>
        <div>
          <Heading level={3}>{this.props.metric}</Heading>
          <p>{_.get(meta, 'description')}</p>
        </div>

        <div>
          <MetricGraph editable metric={meta} data={this.props.data} relationship={this.props.relationship} />
        </div>
      </div>
    );
  }
});