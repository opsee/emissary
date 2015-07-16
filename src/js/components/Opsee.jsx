import React from 'react';
import Router from 'react-router';
import Header from './global/Header.jsx';
const RouteHandler = Router.RouteHandler;

export default React.createClass({
  render() {
    console.log(this.props.params);
    return (
      <div>
        <Header/>
        <RouteHandler/>
      </div>
    );
  }
});