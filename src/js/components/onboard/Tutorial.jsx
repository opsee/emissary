import React from 'react';
import {Toolbar} from '../global';
import {RouteHandler} from 'react-router';

export default React.createClass({
  render() {
    return (
       <div>
         <Toolbar title="How Opsee Works"/>
         <RouteHandler/>
      </div>
    );
  }
});
