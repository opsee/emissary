import _ from 'lodash';
import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Heading} from '../type';
import {Padding} from '../layout';
import {env as actions} from '../../actions';
import {Button} from '../forms';
import {Add, Delete} from '../icons';
import metrics from '../../modules/metrics';
import AssertionMetric from './AssertionMetric';

const AssertionSelectionCloudwatch = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getMetricRDS: PropTypes.func
    }),
    redux: PropTypes.shape({
      env: PropTypes.shape({
        instances: PropTypes.object
      })
    }),
    check: PropTypes.shape({
      target: PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string
      }),
      assertions: PropTypes.array
    }).isRequired,
    onChange: PropTypes.func
  },
  getMetrics(){
    let {type} = this.props.check.target;
    type = type === 'instance' ? 'ecc' : type;
    type = type === 'dbinstance' ? 'rds' : type;
    return _.pickBy(metrics, v => _.includes(v.types, type));
  },
  getMetricTitle(metricName){
    return _.get(this.getMetrics(), `${metricName}.title`);
  },
  handleDeleteClick(index){
    const assertions = _.reject(this.props.check.assertions, (n, i) => i === index);
    return this.props.onChange(assertions);
  },
  handleMetricClick(value){
    const assertions = this.props.check.assertions.concat([{
      key: 'cloudwatch',
      value,
      relationship: undefined,
      operand: 0
    }]);
    return this.props.onChange(assertions);
  },
  handleAssertionChange(index, data){
    const assertions = this.props.check.assertions.map((assertion, i) => {
      return index === i ? data : assertion;
    });
    return this.props.onChange(assertions);
  },
  renderButtons() {
    const buttons = _.keys(this.getMetrics()).map(key => {
      return (
        <Button color="primary" onClick={this.handleMetricClick.bind(null, key)} flat key={`cloudwatch-metric-button-${key}`} style={{margin: '0 1rem 1rem 0'}}>
          <Add inline fill="primary"/>&nbsp;{key}
        </Button>
      );
    });
    return <div>{buttons}</div>;
  },
  render() {
    return (
      <div>
        {this.props.check.assertions.map((assertion, index) => {
          return (
            <div>
              <Heading level={3} className="display-flex flex-1 flex-vertical-align">
                <span className="flex-1">#{index + 1}&nbsp;{_.get(this.getMetrics(), `${assertion.value}.title`)}</span>
                <Button flat color="danger" title={`Remove ${assertion.value} assertion`} onClick={this.handleDeleteClick.bind(null, index)} style={{padding: '0.2rem'}}>
                  <Delete inline fill="danger"/>
                </Button>
              </Heading>
              <AssertionMetric check={this.props.check} assertion={assertion} key={`metric-assertion-${index}`} onChange={this.handleAssertionChange.bind(null, index)}/>
            </div>
          );
        })}
        <Padding t={1}>
          <Heading level={3}>Add an Assertion</Heading>
        </Padding>
        {this.renderButtons()}
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

export default connect(mapStateToProps, mapDispatchToProps)(AssertionSelectionCloudwatch);