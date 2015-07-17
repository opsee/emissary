import React from 'react';
import Router from 'react-router';
import Header from './global/Header.jsx';
const RouteHandler = Router.RouteHandler;

export default React.createClass({
  render() {
    return (
      <div>
        <Header/>
        <RouteHandler/>
      </div>
    );
  }
});