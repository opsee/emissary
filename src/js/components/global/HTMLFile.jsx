import React, {PropTypes} from 'react';
import request from '../../modules/request';
import Alert from './Alert.jsx';
import {Highlight} from '../global';
import HtmlToReact from 'html-to-react';
const Parser = HtmlToReact.Parser(React);

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
      err = err.message || err;
      this.setState({error:err.toString()});
    })
  },
  getParsedHtml(){
    return Parser.parse(this.state.html);
    // return React.renderToStaticMarkup(component);
  },
  render() {
    if(this.state.error){
      return (
        <Alert type="danger">
          HTML error: {this.state.error}
        </Alert>
      )
    }else if(this.state.html){
      // return this.getParsedHtml();
      return <div dangerouslySetInnerHTML={{__html:this.state.html}}/>
    }else{
      return <div/>;
    }
  }
});
