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

  componentWillReceiveProps(nextProps) {
    // Reset threshold if metric is different so it can be recalculated
    if (nextProps.metric !== this.props.metric) {
      this.setState({ threshold: null });
    }
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
    const string = _.chain(relationships).find(r => {
      return r.id === rel;
    }).get('name').value() || '';
    return string.toLowerCase();
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

  /*
   * If the user hasn't set a threshold yet BUT we have data, we can infer a good
   * suggested threshold: somewhere between the average and the maximum values.
   */
  getThresholdSuggestion() {
    const data = this.props.data;
    if (!data.length) {
      return 0;
    }

    // FIXME too much looping
    const values = _.map(data, d => d.value);
    const max = _.max(values);
    const mean = _.mean(values);
    const suggestedThreshold = (max + mean) / 2;
    const fixedThreshold = parseFloat(Math.round(suggestedThreshold * 100) / 100).toFixed(2);
    return Number(fixedThreshold);
  },

  getThresholdValue() {
    const threshold = this.state.threshold;
    return threshold !== null ? threshold : this.getThresholdSuggestion();
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
    const threshold = this.getThresholdValue();

    return (
      <div>
        <Heading level={3}>{this.props.metric}</Heading>
        <p>{_.get(meta, 'description')}</p>
        
        <div style={{overflow: 'hidden'}}>
          <MetricGraph threshold={threshold} metric={meta} data={this.props.data} relationship={this.state.relationship} />
        </div>

        <Padding tb={2}>
          <Padding tb={1}>
            <code style={{fontSize: '1.4rem'}}><Color c="primary">{`${this.getCurrentDataPoint().value} ${meta.units}`}</Color></code>
          </Padding>

          <div className="flex-vertical-align">
            <Padding r={1}>
              <Button flat onClick={this.onRelationshipChange}>{this.state.relationship}</Button>
            </Padding>

            <div className="flex-grow-1">
              <input type="number" step={this.getStepSize()} value={threshold} onChange={this.onThresholdChange} autoFocus />
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