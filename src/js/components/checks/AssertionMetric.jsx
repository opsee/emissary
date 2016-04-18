import _ from 'lodash';
import React, { PropTypes } from 'react';

import {Button} from '../forms';
import {Padding} from '../layout';
import {Color, Heading} from '../type';
import MetricGraph from '../global/MetricGraph';
import rdsMetrics from '../../modules/rdsMetrics';
import relationships from 'slate/src/relationships';

export default React.createClass({
  propTypes: {
    metric: PropTypes.oneOf(_.keys(rdsMetrics)).isRequired,

    data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      unit: PropTypes.string,
      value: PropTypes.number.isRequired
    })).isRequired
  },

  componentWillReceiveProps() {
    // TODO reset threshold if metric is different
  },

  getInitialState() {
    return {
      relationship: 'lessThan',
      threshold: null
    };
  },

  getCurrentDataPoint() {
    return _.last(this.props.data) || {};
  },

  getMetricMeta() {
    // Populates the metric metadata (description, units, etc.)
    const meta = _.get(rdsMetrics, this.props.metric, {});
    return _.assign({}, meta, {
      name: this.props.metric
    });
  },

  getRelationship(){
    const rel = this.state.relationship;
    return _.chain(relationships).find(r => {
      return r.id === rel;
    }).get('name').value().toLowerCase();
  },

  getStepSize() {
    const data = this.props.data;
    const values = _.map(data, d => d.value);
    const min = _.min(values);
    const max = _.max(values);
    const range = max - min;
    const step = Math.pow(10, (Math.floor(Math.log10(2 * range)))) / 10;
    return step;
  },

  getThreshold() {
    // Return the actual threshold if there is one
    if (this.state.threshold !== null) {
      return this.state.threshold;
    }

    // If there isn't a threshold yet AND we have data, we can infer a good
    // suggestion; somewhere between the average and the maximum values.
    const data = this.props.data;
    if (!data.length) {
      return 0;
    }

    const values = _.map(data, d => d.value);
    const max = _.max(values);
    const mean = _.mean(values);
    const suggestedThreshold = (max + mean) / 2;
    const fixedThreshold = parseFloat(Math.round(suggestedThreshold * 100) / 100).toFixed(2);

    return fixedThreshold;
  },

  onRelationshipChange() {
    // Just toggle it for now
    const current = this.state.relationship;
    const relationship = current === 'lessThan' ? 'greaterThan' : 'lessThan';
    this.setState({ relationship });
  },

  onThresholdChange(e) {
    const threshold = e.target.value;
    if (threshold >= 0) {
      this.setState({ threshold });
    }
  },

  render() {
    // TODO render status (green/red bar)
    const meta = this.getMetricMeta();
    return (
      <div>
        <div>
          <Heading level={3}>{this.props.metric}</Heading>
          <p>{_.get(meta, 'description')}</p>
        </div>

        <div>
          <MetricGraph editable threshold={this.getThreshold()}
            metric={meta} data={this.props.data} relationship={this.state.relationship} />
        </div>

        <Padding tb={2}>
          <div>
            <Padding tb={1}>
              <code style={{fontSize: '1.4rem'}}><Color c="primary">{`${this.getCurrentDataPoint().value} ${meta.units}`}</Color></code>
            </Padding>
          </div>

          <div className="flex-vertical-align">
            <div>
              <Padding r={1}>
                <Button flat onClick={this.onRelationshipChange}>{this.state.relationship}</Button>
              </Padding>
            </div>

            <div className="flex-grow-1">
              <input type="number" step={this.getStepSize()} value={this.state.threshold || ''} onChange={this.onThresholdChange} autoFocus />
            </div>
            <Padding l={1}>
              {meta.units}
            </Padding>
          </div>
        </Padding>
      </div>
    );
  }
});