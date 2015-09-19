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
  componentWillMount(){
    setTimeout(() => {
      this.setState({
        show:true
      })
    },this.props.timeout)
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