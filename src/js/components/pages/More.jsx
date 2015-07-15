import React, {PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button';
import Toolbar from '../global/Toolbar.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        <Toolbar title="Other Pages"/>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-sm-offset-1">
              <h3>Delete this page and route before launch</h3>
              <ul>
                <li><a href="/start">Signup</a></li>
                <li><a href="/intro/1">Tutorial</a></li>
                <li><a href="/start/password">Set Password</a></li>
                <li><a href="/start/profile">Onboarding Profile Edit</a></li>
                <li><a href="/start/team">Create Team</a></li>
                <li><a href="/start/region-select">Region Select</a></li>
                <li><a href="/start/credentials">Credentials</a></li>
                <li><a href="/start/vpc-select">VPC Scan + Select</a></li>
                <li><a href="/start/bastion">Bastion Installation</a></li>
                <li><a href="/admin/signups">Admin: Signups</a></li>
                <li><a href="/system-status">System Status</a></li>
                <li><a href="/styleguide">Style Guide</a></li>
                <li><a href="/docs">Docs</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
