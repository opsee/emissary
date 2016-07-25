import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import {connect} from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import style from './stateGraph.css';

const StateGraph = React.createClass({
  propTypes: {
    transitions: PropTypes.array.isRequired,
    current: PropTypes.string.isRequired,
    tickNumber: PropTypes.number,
    scheme: PropTypes.string
  },
  getDefaultProps() {
    return {
      transitions: [],
      tickNumber: 6
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
    const start = moment().subtract({hours: 6}).valueOf();
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
      const z = 'h';
      const tick = moment().diff(moment(time), z);
      return `-${tick}${z}`;
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
  onWindowResize() {
    if (this.isMounted()){
      const elem = ReactDOM.findDOMNode(this);
      const width = _.clamp(elem.parentNode.offsetWidth, 0, Infinity);
      this.setState({ width });
    }
  },
  render(){
    return (
      <div>
        <div className={cx(style.wrapper, style[this.props.scheme])}>
          {
            this.getData(true).map(d => {
              return (
                <div className={cx(style.item, style[d.to])} style={{width: `calc(${d.percent}% - 2px)`}} title={this.getItemTitle(d)}/>
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
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(StateGraph);