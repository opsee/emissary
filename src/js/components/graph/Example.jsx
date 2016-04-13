import _ from 'lodash';
import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Grid, Row, Col} from '../../modules/bootstrap';
import {env as actions} from '../../actions';
import MetricGraph from './MetricGraph';
import {Button} from '../forms';
import rdsMetrics from '../../modules/rdsMetrics';

const GraphExample = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getMetricRDS: PropTypes.func
    }),
    redux: PropTypes.shape({
      env: PropTypes.shape({
        metrics: PropTypes.array
      })
    })
  },

  getInitialState() {
    return {
      rdsID: 'mysql',
      metric: 'CPUUtilization',
      threshold: null
    };
  },

  componentDidMount() {
    this.props.actions.getMetricRDS(this.state.rdsID, this.state.metric);
  },

  getMeta() {
    const name = this.state.metric;
    const meta = _.get(rdsMetrics, name, {});
    return _.assign({}, meta, { name });
  },

  getMetrics() {
    return this.props.redux.env.metrics[0];
  },

  getDataPoints() {
    const metrics = this.getMetrics();
    return _.get(metrics, ['metrics', this.state.metric, 'metrics'], []);
  },

  getStepSize() {
    const metric = this.getMeta();
    const data = this.getDataPoints();
    const values = _.map(data, d => d.value);
    const min = _.min(values);
    const max = _.max(values);
    const range = max - min;
    const step = Math.pow(10, (Math.floor(Math.log10(2*range)))) / 10;
    return step;
  },

  getThreshold() {
    // Return the actual threshold if there is one
    if (this.state.threshold !== null) {
      return this.state.threshold;
    }

    // If there isn't a threshold yet AND we have data, we can infer a good
    // suggestion; somewhere between the average and the maximum values.
    const data = this.getDataPoints();
    if (!data.length) {
      return 0;
    }

    const values = _.map(data, d => d.value);
    const max = _.max(values);
    const mean = _.mean(values);
    const suggestedThreshold = (max + mean) / 2;

    return suggestedThreshold;
  },

  onMetricChange(metric) {
    this.setState({ metric, threshold: null });
    this.props.actions.getMetricRDS(this.state.rdsID, metric);
  },

  onThresholdChange(e) {
    const threshold = e.target.value;
    if (threshold >= 0) {
      this.setState({ threshold });
    }
  },

  renderButtons() {
    const self = this;
    const buttons = [];

    _.mapValues(rdsMetrics, (metric, name) => {
      buttons.push(
        <Button key={name} onClick={self.onMetricChange.bind(self, name)} flat>
          {name}
        </Button>
      );
    });
    return buttons;
  },

  render() {
    const threshold = this.getThreshold();

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <h1>{this.state.rdsID}</h1>
              <h2>{this.state.metric}</h2>
              <p>{this.getMeta().description}</p>

              <div>
                <MetricGraph metric={this.getMeta()} data={this.getDataPoints()} threshold={threshold} />
              </div>

              <div>
                <input type="number" step={this.getStepSize()} value={threshold} onChange={this.onThresholdChange} autoFocus />
              </div>

              <div>
                {this.renderButtons()}
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GraphExample);