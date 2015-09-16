import React, {PropTypes} from 'react';
import request from '../../modules/request';
import Alert from './Alert.jsx';

export default React.createClass({
  propTypes:{
    path:PropTypes.string.isRequired
  },
  getInitialState(){
    return {
      html:null,
      error:null
    }
  },
  componentWillMount(){
    request.get(this.props.path).then(res => {
      this.setState({html:res.text});
    }).catch(err => {
      this.setState({error:err && err.message});
    })
  },
  render() {
    if(this.state.error){
      return (
        <Alert type="danger">
          HTML error: {this.state.error}
        </Alert>
      )
    }else if(this.state.html){
      return <div dangerouslySetInnerHTML={{__html:this.state.html}}/>
    }else{
      return <div>poo</div>
    }
  }
});
