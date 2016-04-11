import _ from 'lodash';
import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Grid, Row, Col} from '../../modules/bootstrap';
import {env as actions} from '../../actions';
import MetricGraph from './MetricGraph';

const GraphExample = React.createClass({

  getInitialState() {
    return {
      rdsID: 'mysql',
      metric: 'CPUUtilization'
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
    return _.get(metrics.metrics, this.state.metric).metrics;
  },

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col>
              <h1>{this.state.metric}</h1>
              <h2>{this.state.rdsID}</h2>

              <div>
                <MetricGraph />
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
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(GraphExample);