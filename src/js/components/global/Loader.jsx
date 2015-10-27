import React, {PropTypes} from 'react';
import SearchBox from './SearchBox.jsx';
import _ from 'lodash';
import style from './loader.css';

export default React.createClass({
  propTypes: {
    //wait X number of seconds until showing the loader
    timeout: PropTypes.number
  },
  getInitialState(){
    return {
      show: false
    }
  },
  componentDidMount(){
    var self = this;
    setTimeout(() => {
      if (self.isMounted()){
        self.setState({
          show: true
        })
      }
    }, self.props.timeout || 700)
  },
  render(){
    if (this.state.show){
      return (
        <div className="display-flex justify-content-center">
          <div className={style.loader}></div>
        </div>
      )
    }else{
      return <div/>
    }
  }
})