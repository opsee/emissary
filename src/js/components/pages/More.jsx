import React, {PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import Toolbar from '../global/Toolbar.jsx';
import Router from 'react-router';
const RouteHandler = Router.RouteHandler;
import Link from 'react-router/lib/components/Link';

export default React.createClass({
  componentDidMount(){
    console.log(this.props.params);
  },
  render() {
    console.log(this.props.params);
    return (
      <div>
        <Toolbar title="Other Pages"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <h3>Delete this page and route before launch</h3>
              <ul>
                <li><Link to="start">Signup</Link></li>
                <li><Link to="tutorial">Tutorial</Link></li>
                <li><Link to="onboardPassword">Set Password</Link></li>
                <li><Link to="onboardProfile">Onboarding Profile Edit</Link></li>
                <li><Link to="onboardTeam">Create Team</Link></li>
                <li><Link to="onboardRegionSelect">Region Select</Link></li>
                <li><Link to="onboardCredentials">Credentials</Link></li>
                <li><Link to="onboardVpcSelect">VPC Scan + Select</Link></li>
                <li><Link to="onboardBastion">Bastion Installation</Link></li>
                <li><Link to="adminSignups">Admin: Signups</Link></li>
                <li><Link to="systemStatus">System Status</Link></li>
                <li><Link to="styleguide">Style Guide</Link></li>
                <li><Link to="docs">Docs</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <RouteHandler {...this.props}/>
      </div>
    );
  }
});
