import _ from 'lodash';

export default {
  SetInterval: {
    componentWillMount(){
      this.intervals = [];
    },
    setInterval(){
      this.intervals.push(setInterval.apply(null, arguments));
    },
    componentWillUnmount(){
      this.intervals.map(clearInterval);
    }
  },
  Analytics: {
    componentWillReceiveProps(nextProps){
      if(!_.isEqual(nextProps.location, this.props.location)){
        console.log(nextProps.location);
      }
    }
  }
};