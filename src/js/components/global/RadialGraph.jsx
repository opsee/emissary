import React from 'react';
import moment from 'moment';

export default React.createClass({
  getInitialState() {
    return {
      on:false
    }
  },
  getDefaultProps(){
    return {
      width:40
    }
  },
  getTitle(){
    switch(this.props.status.state){
      case 'running':
      return this.props.status.silence.remaining ? 
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
  getText(){
    const millis = this.props.status.silence.remaining;
    if(!millis || millis < 0){
      return this.props.status.health;
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
    const health = this.props.status.health;
    if(!health){return '';}
    let percentage;
    if(this.props.status.silence.remaining){
      percentage = this.props.status.silence.remaining / this.props.status.silence.duration;
      percentage *= 100;
    } else {
      percentage = health;
    }

    if (percentage >= 100) {
      percentage = 99;
    } else if (percentage < 0) {
      percentage = 0;
    }

    percentage = parseInt(percentage,10);
    const w = this.props.width/2;
    const α = (percentage/100)*360;
    const r = ( α * Math.PI / 180 );
    const x = Math.sin( r ) * w;
    const y = Math.cos( r ) * - w;
    const mid = ( α > 180 ) ? 1 : 0;
    return `M 0 0 v -${w} A ${w} ${w} 1 ${mid} 1 ${x} ${y} z`;
  },
  getTranslate(){
    const w = this.props.width/2;
    return `translate(${w},${w})`;
  },
  isFailingOrPassing(){
    return this.props.status.health < 50 ? 'failing' : 'passing';
  },
  isPerfect(){
    return this.props.status.health == 100 ? 'perfect' : '';
  },
  render() {
    const text = 'foo';
    const status = this.props.status;
    if(!status){
      return(
        <div>
          No status defined.
        </div>
      )
    }
    return (
      <div className={`radial-graph ${status.state} ${this.isPerfect()} (status.silence.remaining ? ' silenced' : '')`} title={this.getTitle()}>
        <svg>
          <path className="loader" transform={this.getTranslate()} d={this.getPath()}/>
        </svg>
        <div className={`radial-graph-inner ${this.isFailingOrPassing()}`}>{this.getText()}</div>
      <div className="pie-slice"></div>
    </div>
    );
  }
});