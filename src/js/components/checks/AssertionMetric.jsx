import _ from 'lodash';
import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Map} from 'immutable';
import cx from 'classnames';
import slate from 'slate';

import {Button, Input} from '../forms';
import {Padding, Rule} from '../layout';
import {Color} from '../type';
import {env as actions} from '../../actions';
import MetricGraph from '../global/MetricGraph';
import rdsMetrics from '../../modules/rdsMetrics';
import relationships from 'slate/src/relationships';
import style from './assertionMetric.css';

const AssertionMetric = React.createClass({
  propTypes: {
    actions: PropTypes.shape({
      getMetricRDS: PropTypes.func
    }),
    assertion: PropTypes.shape({
      value: PropTypes.string,
      operand: PropTypes.string,
      key: PropTypes.string,
      relationship: PropTypes.string
    }).isRequired,
    check: PropTypes.shape({
      target: PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string
      })
    }).isRequired,
    redux: PropTypes.shape({
      env: PropTypes.shape({
        instances: PropTypes.shape({
          rds: PropTypes.object
        })
      })
    }).isRequired,
    onChange: PropTypes.func.isRequired
  },
  componentWillMount(){
    if (!this.getData().length){
      setTimeout(() => {
        this.props.actions.getMetricRDS(this.props.check.target.id, this.props.assertion.value);
      }, 0);
    }
  },
  componentWillReceiveProps(nextProps) {
    // Reset threshold if metric is different so it can be recalculated
    if (nextProps.assertion.value !== this.props.assertion.value) {
      this.setState({ threshold: null });
    }
  },
  getInitialState() {
    return {
      relationship: 'lessThan',
      threshold: null
    };
  },
  getInstance() {
    return this.props.redux.env.instances[this.props.check.target.type].find(i => {
      return i.get('id') === this.props.check.target.id;
    }) || new Map();
  },
  getData(){
    return _.get(this.getInstance().toJS(), ['metrics', this.props.assertion.value, 'metrics']) || [];
  },
  getCurrentDataPoint() {
    return _.last(this.getData()) || {};
  },
  getMetricMeta() {
    // Populates the metric metadata (description, units, etc.)
    const meta = _.get(rdsMetrics, this.props.assertion.value, {});
    return _.assign({}, meta, {
      name: this.props.assertion.value
    });
  },
  getRelationship(){
    const rel = this.props.assertion.relationship;
    const string = _.chain(relationships).find(r => {
      return r.id === rel;
    }).get('name').value() || '';
    return string.toLowerCase();
  },
  getStepSize() {
    const data = this.getData();
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
    const data = this.getData();
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
  getStatusString(){
    const bool = this.isPassing();
    if (bool !== undefined){
      return bool ? 'passing' : 'failing';
    }
    return undefined;
  },
  isPassing(){
    const current = this.getCurrentDataPoint();
    if (current && _.chain(this.props.assertion).values().every().value()){
      const response = {
        metrics: [current]
      };
      const results = slate.checkAssertion(this.props.assertion, response);
      return !results.error;
    }
    return undefined;
  },
  onRelationshipChange() {
    return this.props.onChange(_.assign({}, this.props.assertion, {relationship: undefined}));
  },
  onOperandChange(assertion) {
    return this.props.onChange(assertion);
  },
  handleRelationshipButtonClick(relationship){
    return this.props.onChange(_.assign({}, this.props.assertion, {relationship}));
  },
  renderInputArea(){
    const meta = this.getMetricMeta();
    return (
      <Padding b={1} className="flex-vertical-align">
        <Padding r={1}>
          <Button flat onClick={this.onRelationshipChange}>{_.find(relationships, {id: this.props.assertion.relationship}).name}</Button>
        </Padding>

        <div className="flex-grow-1">
          <Input type="number" data={this.props.assertion} path="operand" step={this.getStepSize()} onChange={this.onOperandChange} autoFocus noValidate autoComplete="off" autoCorrect="off"/>
        </div>
        <Padding l={1}>
          {meta.units}
        </Padding>
      </Padding>
    );
  },
  renderRelationshipButtons(){
    return (
      <div>
        {_.filter(relationships, rel => rel.id.match(/equal|than/gi)).map(rel => {
          return (
            <Button flat onClick={this.handleRelationshipButtonClick.bind(null, rel.id)} key={`relationship-${rel.id}`} style={{margin: '0 1rem 1rem 0'}}>{rel.name}</Button>
          );
        })}
      </div>
    );
  },
  renderStep(){
    return this.props.assertion.relationship ? this.renderInputArea() : this.renderRelationshipButtons();
  },
  renderCurrentDataPoint(){
    const data = this.getCurrentDataPoint();
    const meta = this.getMetricMeta();
    if (data && data.value !== undefined){
      return (
        <code style={{fontSize: '1.4rem'}}><Color c="primary">{`${data.value} ${meta.units}`}</Color></code>
      );
    }
    return null;
  },
  render() {
    const meta = this.getMetricMeta();
    return (
      <div>
        <Padding className={cx(style.item, style[this.getStatusString()])} l={2}>
          <p>{_.get(meta, 'description')}</p>
          <div style={{overflow: 'hidden'}}>
            <MetricGraph threshold={this.props.assertion.operand} metric={meta} data={this.getData()} assertion={this.props.assertion} showTooltip={!!this.props.assertion.relationship}/>
          </div>
          <Padding t={2}>
            {this.renderCurrentDataPoint()}
            <Padding t={1}>
              {this.renderStep()}
            </Padding>
          </Padding>
        </Padding>
        <Rule/>
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

export default connect(mapStateToProps, mapDispatchToProps)(AssertionMetric);