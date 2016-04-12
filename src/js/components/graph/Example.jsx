import _ from 'lodash';
import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Grid, Row, Col} from '../../modules/bootstrap';
import {env as actions} from '../../actions';
import MetricGraph from './MetricGraph';

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

  getMetrics() {
    return this.props.redux.env.metrics[0];
  },

  getDataPoints() {
    const metrics = this.getMetrics();
    return metrics ? _.get(metrics.metrics, this.state.metric).metrics : [];
  },

  onThresholdChange(e) {
    this.setState({ threshold: e.target.value });
  },

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <h1>{this.state.metric}</h1>
              <h2>{this.state.rdsID}</h2>

              <div>
                <MetricGraph data={this.getDataPoints()} threshold={this.state.threshold} />
              </div>

              <div>
                <input type="number" step="0.1" value={this.state.threshold} onChange={this.onThresholdChange} />
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