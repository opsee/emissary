import React from 'react';
import moment from 'moment';
import colors from 'seedling/colors';
import _ from 'lodash';

import {SetInterval} from '../../modules/mixins';
import style from './radialGraph.css';

const radialWidth = 40;

const RadialGraph = React.createClass({
  mixins: [SetInterval],
  getInitialState() {
    return _.defaults({
      silenceRemaining:0
    }, this.props);
  },
  componentDidMount(){
    this.setupSilence()
  },
  componentWillReceiveProps(nextProps){
    if(!this.state.silenceRemaining){
      this.setupSilence();
    }
  },
  tick(){
    this.setState({
      silenceRemaining:this.getSilenceRemaining()
    });
  },
  getBaseClass(){
    let state = this.getRadialState();
    return style[`base${_.startCase(state)}`]
  },
  getInnerClass(){
    let state = this.getRadialState();
    return style[`inner${_.startCase(state)}`]
  },
  getSvgClass(){
    let state = this.getRadialState();
    return style[`svg${_.startCase(state)}`]
  },
  getRadialState(){
    let state = this.props.state;
    const health = this.props.health;
    state = health == 100 ? 'perfect' : state;
    state = health < 100 ? 'running' : state;
    state = this.state.silenceRemaining ? 'silenced' : state;
    return state;
  },
  setupSilence(){
    const remaining = this.getSilenceRemaining();
    if(remaining){
      this.setInterval(this.tick,1000);
      this.tick();
    }else{
      this.intervals.map(clearInterval);
    }
  },
  getTitle(){
    switch(this.state.state){
      case 'running':
      return this.state.silenceRemaining ?
      `This check is running, but is ` :
      `This check is running and has a health of %`;
      break;
      case 'unmonitored':
      return 'This check is currently unmonitored.';
      break;
      case 'stopped':
      return 'This check is stopped in AWS.';
      break;
    }
  },
  getSilenceRemaining(){
    const startDate = this.state.silenceDate;
    let num = 0;
    if(startDate && startDate instanceof Date){
      const finalVal = startDate.valueOf() + this.state.silenceDuration;
      num = finalVal - Date.now();
    }
    return num > 0 ? num : 0;
  },
  getText(){
    const millis = this.state.silenceRemaining;
    if(!millis || millis < 0){
      return this.props.health;
    }
    const duration = moment.duration(millis);
    let unit = 'h';
    let time = duration.as(unit);
    if(time < 1){
      unit = 'm';
      time = duration.as(unit);
    }
    if(time < 1){
      unit = 's';
      time = duration.as(unit);
    }
    return Math.ceil(time)+unit;
    return (time,10)+unit;
  },
  getPath(){
    const health = this.props.health;
    if(!health){return '';}
    let percentage;
    if(this.state.silenceRemaining){
      percentage = (this.state.silenceRemaining / this.state.silenceDuration) * 100;
    } else {
      percentage = health;
    }

    if (percentage >= 100) {
      percentage = 99;
    } else if (percentage < 0) {
      percentage = 0;
    }

    percentage = parseInt(percentage,10);
    const w = radialWidth/2;
    const α = (percentage/100)*360;
    const r = ( α * Math.PI / 180 );
    const x = Math.sin( r ) * w;
    const y = Math.cos( r ) * - w;
    const mid = ( α > 180 ) ? 1 : 0;
    return `M 0 0 v -${w} A ${w} ${w} 1 ${mid} 1 ${x} ${y} z`;
  },
  getTranslate(){
    const w = radialWidth/2;
    return `translate(${w},${w})`;
  },
  render() {
    if(!this.state.state){
      return <div>No state defined.</div>
    }
    return (
      <div className={this.getBaseClass()} title={this.getTitle()}>
        <svg className={this.getSvgClass()}>
          <path transform={this.getTranslate()} d={this.getPath()}/>
        </svg>
        <div className={this.getInnerClass()}>{this.getText()}</div>
    </div>
    );
  }
});

export default RadialGraph;