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
      threshold: 1.0
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

  onMetricChange(metric) {
    this.setState({ metric });
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
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <h1>{this.state.rdsID}</h1>
              <h2>{this.state.metric}</h2>
              <p>{this.getMeta().description}</p>

              <div>
                <MetricGraph metric={this.getMeta()} data={this.getDataPoints()} threshold={this.state.threshold} />
              </div>

              <div>
                <input type="number" step="0.1" value={this.state.threshold} onChange={this.onThresholdChange} autoFocus />
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