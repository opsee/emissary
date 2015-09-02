import React, {PropTypes} from 'react';
import {Toolbar} from '../global';
import UserInputs from '../user/UserInputs.jsx';
import {OnboardStore} from '../../stores';
import {OnboardActions} from '../../actions';
import {UserStore} from '../../stores';
import {Link} from 'react-router';
import Router, {RouteHandler} from 'react-router';

export default React.createClass({
  render() {
    return (
       <div>
         <Toolbar title="This is How We Do It"/>
         <RouteHandler/>
      </div>
    );
  }
});
