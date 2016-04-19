import _ from 'lodash';
import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Map} from 'immutable';

import {Grid, Row, Col} from '../layout';
import {env as actions} from '../../actions';
// import MetricGraph from './MetricGraph';
import {Button} from '../forms';
import rdsMetrics from '../../modules/rdsMetrics';
import {Heading} from '../type';
import AssertionMetric from '../checks/AssertionMetric';

const GraphExample = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getMetricRDS: PropTypes.func
    }),
    redux: PropTypes.shape({
      env: PropTypes.shape({
        instances: PropTypes.object
      })
    })
  },

  getInitialState() {
    return {
      rdsID: 'mysql',
      metric: 'CPUUtilization'
    };
  },

  componentDidMount() {
    this.props.actions.getMetricRDS(this.state.rdsID, this.state.metric);
  },

  getInstance() {
    return this.props.redux.env.instances.rds.find(i => {
      return i.get('id') === this.state.rdsID;
    }) || new Map();
  },

  getDataPoints() {
    const dataPoints = _.get(this.getInstance(), ['metrics', this.state.metric, 'metrics'], []);
    // FIXME sorting is required by d3, but ultimately this should be done in compost
    return  _.sortBy(dataPoints, d => d.timestamp);
  },

  onMetricChange(metric) {
    this.setState({ metric, threshold: null });
    this.props.actions.getMetricRDS(this.state.rdsID, metric);
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
    const instance = this.getInstance().toJS();
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Heading>{_.get(instance, 'name')}</Heading>
            <AssertionMetric metric={this.state.metric} data={this.getDataPoints()} />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            {this.renderButtons()}
          </Col>
        </Row>
      </Grid>
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