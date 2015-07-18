import React from 'react';
import moment from 'moment';
import Radium from 'radium';

var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.map(clearInterval);
  }
};

export default React.createClass({
  mixins: [SetIntervalMixin],
  getInitialState() {
    return this.props;
  },
  getDefaultProps(){
    return {
      width:40,
      silenceRemaining:0
    }
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
    switch(this.state.status.state){
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
    const startDate = this.state.status.silence.startDate;
    let num = 0;
    if(startDate && startDate instanceof Date){
      const finalVal = startDate.valueOf() + this.state.status.silence.duration;
      num = finalVal - Date.now();
    }
    return num > 0 ? num : 0;
  },
  getText(){
    const millis = this.state.silenceRemaining;
    if(!millis || millis < 0){
      return this.state.status.health;
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
    const health = this.state.status.health;
    if(!health){return '';}
    let percentage;
    if(this.state.silenceRemaining){
      percentage = (this.state.silenceRemaining / this.state.status.silence.duration) * 100;
    } else {
      percentage = health;
    }

    if (percentage >= 100) {
      percentage = 99;
    } else if (percentage < 0) {
      percentage = 0;
    }

    percentage = parseInt(percentage,10);
    const w = this.state.width/2;
    const α = (percentage/100)*360;
    const r = ( α * Math.PI / 180 );
    const x = Math.sin( r ) * w;
    const y = Math.cos( r ) * - w;
    const mid = ( α > 180 ) ? 1 : 0;
    return `M 0 0 v -${w} A ${w} ${w} 1 ${mid} 1 ${x} ${y} z`;
  },
  getTranslate(){
    const w = this.state.width/2;
    return `translate(${w},${w})`;
  },
  isFailing(){
    return this.state.status.health < 50;
  },
  isPerfect(){
    return this.state.status.health == 100;
  },
  render() {
    if(!this.state.status){
      return(
        <div>
          No status defined.
        </div>
      )
    }
    return (
      <div className={`radial-graph ${this.state.status.state} ${this.isPerfect() ? 'perfect' : ''} ${(this.state.silenceRemaining ? ' silenced' : '')}`} title={this.getTitle()}>
        <svg>
          <path className="loader" transform={this.getTranslate()} d={this.getPath()}/>
        </svg>
        <div className={`radial-graph-inner ${this.isFailing() ? 'failing' : 'passing'}`}>{this.getText()}</div>
    </div>
    );
  }
});