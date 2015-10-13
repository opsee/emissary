import React from 'react';
import moment from 'moment';
import Radium from 'radium';
import colors from 'seedling/colors';
import {SetInterval} from '../../modules/mixins';
import _ from 'lodash';

const radialWidth = 40;

const RadialGraph = React.createClass({
  mixins: [SetInterval],
  styles(){
    return {
      base:{
        backgroundColor:"black",
        color:"#303030",
        borderRadius:'100%',
        fontWeight:500,
        position:"relative",
        height:radialWidth,
        width:radialWidth,
        minHeight:radialWidth,
        minWidth:radialWidth,
        margin:'0 1em 0 0.5em',
        fontFamily:"Tungsten Rounded A, Tungsten Rounded B, sans-serif",
        fontSize:'16px'
      },
      parentStatus:() => {
        let state = this.getRadialState();
        let color = colors.danger;
        switch(state){
          case 'perfect':
          color = colors.success;
          break;
          case 'stopped':
          // color = 'gray'//gray-700
          color = colors.danger//gray-700
          break;
          case 'stopped':
          break;
          case 'restarting':
          color = colors.info;
          break;
          case 'unmonitored':
          break;
          case 'silenced':
          color = colors.primary;
          break;
        }
        return {
          backgroundColor:color
        }
      },
      inner:{
        backgroundColor:"transparent",
        borderRadius:"100%",
        border:"3px solid #303030",
        height: radialWidth - 4,
        width: radialWidth - 4,
        left:"50%",
        top:"50%",
        marginTop:-((radialWidth - 4) / 2),
        marginLeft:-((radialWidth - 4) / 2),
        lineHeight: radialWidth - 10 + 'px',
        position: "absolute",
        textAlign: "center",
      },
      innerStatus:() => {
        let state = this.getRadialState();
        const health = this.props.health;
        switch(state){
          case 'running':
          return {
            backgroundColor:health < 100 ? colors.danger : colors.success
          }
          break;
          case 'restarting':
          return {
            backgroundColor:colors.info
          }
          break;
        }
      },
      loader:() => {
        let state = this.getRadialState();
        let color = colors.success;
        switch(state){
          case 'stopped':
          color = colors.success;
          // color = 'gray'//gray-700
          break;
          case 'restarting':
          color = colors.info
          break;
          case 'unmonitored':
          color = colors.warning
          break;
          case 'silenced':
          color = colors.info
          break;
        }
        return {
          fill:color
        }
      }
    }
  },
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
  getRadialState(){
    let state = this.props.state;
    const health = this.props.health;
    state = health == 100 ? 'perfect' : state;
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
      return(
        <div>
          No state defined.
        </div>
      )
    }
    return (
      <div style={[this.styles().base, this.styles().parentStatus()]} title={this.getTitle()}>
        <svg style={{width:radialWidth, height:radialWidth, overflow:'hidden'}}>
          <path className="loader" transform={this.getTranslate()} d={this.getPath()} style={this.styles().loader()}/>
        </svg>
        <div style={[this.styles().inner, this.styles().parentStatus(), this.styles().innerStatus()]}>{this.getText()}</div>
    </div>
    );
  }
});

export default Radium(RadialGraph);