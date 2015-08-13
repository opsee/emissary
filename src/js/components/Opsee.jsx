import React from 'react';
import Router from 'react-router';
import Header from './global/Header.jsx';
import MessageModal from './global/MessageModal.jsx';
import Actions from '../actions/Global';
const RouteHandler = Router.RouteHandler;

export default React.createClass({
  componentDidMount(){
  },
  render() {
    return (
      <div>
        <Header/>
        <RouteHandler/>
        <MessageModal/>
      </div>
    );
  }
});