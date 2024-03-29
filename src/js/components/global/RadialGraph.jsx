import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import cx from 'classnames';

import {SetInterval} from '../../modules/mixins';
import style from './radialGraph.css';

const radialWidth = 40;

const RadialGraph = React.createClass({
  mixins: [SetInterval],
  propTypes: {
    type: PropTypes.string,
    item: PropTypes.object.isRequired,
    scheme: PropTypes.string
  },
  getDefaultProps(){
    return {
      type: 'check'
    };
  },
  getInitialState() {
    return _.defaults({
      silenceRemaining: 0
    }, this.getItem());
  },
  componentDidMount(){
    this.runSetupSilence();
  },
  componentWillReceiveProps(){
    if (!this.state.silenceRemaining){
      this.runSetupSilence();
    }
  },
  getItem(){
    return this.props.item.toJS ? this.props.item.toJS() : this.props.item;
  },
  getHealth(){
    const item = this.getItem();
    return item.total ? Math.floor((item.passing / item.total) * 100) : undefined;
  },
  getBaseClass(){
    return cx(style.base, style[this.getRadialState()]);
  },
  getInnerClass(){
    return cx(style[`inner${_.startCase(this.getRadialState())}`], style[this.props.scheme]);
  },
  getSvgClass(){
    return style[`svg${_.startCase(this.getRadialState())}`];
  },
  getRadialState(){
    return this.getItem().state;
  },
  getTitle(){
    switch (this.state.state){
    case 'passing':
      return `This ${this.props.type} is passing.`;
    case 'failing':
      return this.state.silenceRemaining ?
      `This ${this.props.type} is running, but is ` :
      `This ${this.props.type} is failing with a health of ${this.getHealth()}%`;
    case 'warning':
      return `This ${this.props.type} is currently in a warning state.`;
    case 'running':
      return `This ${this.props.type} is currently unmonitored.`;
    case 'stopped':
      return `This ${this.props.type} is stopped in AWS.`;
    default:
      return '';
    }
  },
  getSilenceRemaining(){
    const startDate = this.state.silenceDate;
    let num = 0;
    if (startDate && startDate instanceof Date){
      const finalVal = startDate.valueOf() + this.state.silenceDuration;
      num = finalVal - Date.now();
    }
    return num > 0 ? num : 0;
  },
  getText(){
    const item = this.getItem();
    switch (item.state) {
    case 'passing':
      return 'pass';
    case 'initializing':
      return 'init';
    case 'failing':
      return 'fail';
    case 'warning':
      return 'warn';
    case 'stopped':
      return 'stop';
    default:
      return null;
    }
  },
  getPath(){
    const health = this.getHealth();
    if (!health){
      return '';
    }
    let percentage;
    if (this.state.silenceRemaining){
      percentage = (this.state.silenceRemaining / this.state.silenceDuration) * 100;
    } else {
      percentage = health;
    }

    if (percentage >= 100) {
      percentage = 99;
    } else if (percentage < 0) {
      percentage = 0;
    }

    percentage = parseInt(percentage, 10);
    const w = radialWidth / 2;
    const α = (percentage / 100) * 360;
    const r = ( α * Math.PI / 180 );
    const x = Math.sin( r ) * w;
    const y = Math.cos( r ) * - w;
    const mid = ( α > 180 ) ? 1 : 0;
    return `M 0 0 v -${w} A ${w} ${w} 1 ${mid} 1 ${x} ${y} z`;
  },
  getTranslate(){
    const w = radialWidth / 2;
    return `translate(${w},${w})`;
  },
  runSilence(){
    this.setState({
      silenceRemaining: this.getSilenceRemaining()
    });
  },
  runSetupSilence(){
    const remaining = this.getSilenceRemaining();
    if (remaining){
      this.setInterval(this.runSilence, 1000);
      this.runSilence();
    } else {
      this.intervals.map(clearInterval);
    }
  },
  render() {
    if (!this.state.state){
      return <div>No state defined.</div>;
    }
    return (
      <div className={this.getBaseClass()} title={this.getTitle()}>
        {this.getText()}
    </div>
    );
  }
});

const mapStateToProps = (state) => ({
  scheme: state.app.scheme
});

export default connect(mapStateToProps)(RadialGraph);