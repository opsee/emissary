import React, {PropTypes} from 'react';
import cx from 'classnames';
import {connect} from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

import style from './stateGraph.css';
import {Color, Heading} from '../type';
import {Padding} from '../layout';

const StateGraph = React.createClass({
  propTypes: {
    transitions: PropTypes.array.isRequired,
    current: PropTypes.string.isRequired,
    tickNumber: PropTypes.number,
    period: PropTypes.number,
    unit: PropTypes.string,
    scheme: PropTypes.string,
    redux: PropTypes.shape({
      checks: PropTypes.shape({
        startHours: PropTypes.number
      })
    })
  },
  getDefaultProps() {
    return {
      transitions: [],
      tickNumber: 8,
      unit: 'hours'
    };
  },
  getCoercedState(state){
    switch (state){
    case 'failing':
      return 'FAIL';
    case 'warning':
      return 'WARN';
    default:
      return 'OK';
    }
  },
  getData(filter){
    const period = this.props.redux.checks.startHours;
    const start = moment().subtract({[this.props.unit]: period}).valueOf();
    const end = Date.now();
    const diff = end - start;
    let {current} = this.props;
    current = this.getCoercedState(current);
    const first = _.head(this.props.transitions) || {to: current, from: current};
    const computedFirst = {to: first.from, from: first.from, occurred_at: start};
    const last = _.last(this.props.transitions) || {to: current, from: current};
    const computedLast = {to: last.to, from: last.to, occurred_at: end};
    let data = [computedFirst].concat(this.props.transitions).concat([computedLast]);
    data = _.chain(data)
    .sortBy(d => d.occurred_at)
    .map(d => _.mapValues(d, (value, key) => {
      if (key.match('^to$|^from$')){
        return (value || '').toLowerCase();
      }
      return value;
    }))
    .value();
    data = _.chain(data).map((d, i) => {
      const next = data[i + 1] || computedLast;
      let percent = (next.occurred_at - d.occurred_at) / diff;
      percent = parseFloat((percent * 100).toFixed(2));
      return _.assign(d, {percent});
    })
    .reject(d => filter && !d.percent)
    .value();
    return data;
  },
  getTicks(){
    const data = this.getData();
    const start = _.head(data).occurred_at;
    const end = _.last(data).occurred_at;
    const diff = end - start;
    const divisor = this.props.tickNumber;
    const unit = diff / divisor;
    return _.chain(_.rangeRight(divisor))
    .map(num => {
      const time = end - ((num + 1) * unit);
      let z = this.props.unit;
      let tick = moment().diff(moment(time), z);
      if (tick > 24 && z === 'hours'){
        z = 'days';
        tick = moment().diff(moment(time), z);
      }
      return `-${tick}${z.charAt(0)}`;
    })
    .value();
  },
  getItemTitle(d){
    let status = d.to;
    switch (status){
    case 'ok':
      status = 'passing';
      break;
    case 'fail':
      status = 'failing';
      break;
    case 'fail_wait':
    case 'pass_wait':
      status = 'warning';
      break;
    default:
      break;
    }
    return `Check was ${status}`;
  },
  getStats(){
    const data = this.getData();
    return {
      passing: _.chain(data).filter({to: 'ok'}).map('percent').sum().thru(n => n.toFixed(2)).value(),
      failing: _.chain(data).filter({to: 'fail'}).map('percent').sum().thru(n => n.toFixed(2)).value(),
      warning: _.chain(data).filter(a => a.to.match('wait|warn')).map('percent').sum().thru(n => n.toFixed(2)).value()
    };
  },
  getLast(){
    const hours = this.props.redux.checks.startHours;
    if (hours > 72){
      const days = Math.floor(hours / 24);
      return `${days} days`;
    }
    return `${hours} hours`;
  },
  render(){
    const stats = this.getStats();
    return (
      <div>
        <Heading level={3}>Activity - Last {this.getLast()}</Heading>
        <Padding b={1} className={cx(style.stats, 'display-flex', 'flex-wrap')}>
          <div>
            <Color c="success"><strong>Passing:&nbsp;</strong></Color>{stats.passing}%&nbsp;&nbsp;
          </div>
          <div>
            <Color c="danger"><strong>Failing:&nbsp;</strong></Color>{stats.failing}%&nbsp;&nbsp;
          </div>
          <div>
            <Color c="warning"><strong>Warning:&nbsp;</strong></Color>{stats.warning}%
          </div>
        </Padding>
        <div className={cx(style.wrapper, style[this.props.scheme])}>
          {
            this.getData(true).map(d => {
              return (
                <div className={cx(style.item, style[d.to])} style={{width: `calc(${d.percent}% - 0px)`}} title={this.getItemTitle(d)}/>
              );
            })
          }
        </div>
        <div className={style.yaxis}>
          {this.getTicks().map(t => {
            return (
              <div style={{width: `${100 / this.props.tickNumber}%`}} className={cx(style.tick, style[this.props.scheme])}>
                {t}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  redux: state,
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(StateGraph);