import React, {PropTypes} from 'react';
import Toolbar from '../global/Toolbar.jsx';
import UserInputs from '../user/UserInputs.jsx';
import OnboardStore from '../../stores/Onboard';
import OnboardActions from '../../actions/Onboard';
import UserStore from '../../stores/User';
import Link from 'react-router/lib/components/Link';
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
