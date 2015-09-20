import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';
import _ from 'lodash';

export default React.createClass({
  propTypes:{
    //wait X number of seconds until showing the loader
    timeout:PropTypes.number
  },
  getInitialState(){
    return {
      show:false
    }
  },
  getDefaultProps(){
    return {
      timeout:0
    }
  },
  componentDidMount(){
    var self = this;
    setTimeout(() => {
      if(self.isMounted()){
        self.setState({
          show:true
        })
      }
    },self.props.timeout)
  },
  render(){
    if(this.state.show){
      return(
        <div className="opsee-loader"></div>
      )
    }else{
      return <div/>
    }
  }
})