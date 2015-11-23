import React from 'react';
import {Route, Redirect, IndexRoute} from 'react-router';
import Opsee from '../global/Opsee';

import Env from '../env/Env';
import EnvGroupsSecurity from '../env/EnvGroupsSecurity';
import EnvGroupsELB from '../env/EnvGroupsELB';
import EnvInstancesEC2 from '../env/EnvInstancesEC2';
import CheckList from '../checks/List';
import CheckSingle from '../checks/Single';
import CheckEdit from '../checks/Edit';
import CheckCreate from '../checks/Create';

import Docs from '../docs/Docs';
import DocsBastion from '../docs/Bastion';
import DocsCloudformation from '../docs/Cloudformation';
import DocsIAM from '../docs/IAM';
import DocsChecks from '../docs/Checks.jsx';

import CheckCreateTarget from '../checks/CheckCreateTarget';
import CheckCreateRequest from '../checks/CheckCreateRequest';
import CheckCreateAssertions from '../checks/CheckCreateAssertions';
import CheckCreateInfo from '../checks/CheckCreateInfo';

import GroupSecurity from '../groups/GroupSecurity';
import GroupELB from '../groups/GroupElb';

import InstanceEC2 from '../instances/InstanceEC2';
import InstanceRDS from '../instances/InstanceRDS';

import Login from '../user/Login';
import PasswordForgot from '../user/PasswordForgot';
import PasswordChange from '../user/PasswordChange';
import Profile from '../user/Profile';
import ProfileEdit from '../user/ProfileEdit';

import OnboardCreate from '../onboard/Create';
import OnboardThanks from '../onboard/Thanks';
import OnboardPassword from '../onboard/Password';
import OnboardTutorial from '../onboard/Tutorial';
import OnboardTutorial1 from '../onboard/Tutorial1';
import OnboardTutorial2 from '../onboard/Tutorial2';
import OnboardTutorial3 from '../onboard/Tutorial3';
// import OnboardTeam from '../onboard/Team';
import OnboardRegionSelect from '../onboard/RegionSelect';
import OnboardCredentials from '../onboard/Credentials';
import OnboardVPCSelect from '../onboard/VPCSelect';
import OnboardInstall from '../onboard/Install';

import AdminSignups from '../admin/Signups';
import AdminSocket from '../admin/Socket';

import Help from '../pages/Help';
import Styleguide from '../pages/Styleguide';
import System from '../env/System';
import NotFound from '../pages/NotFound';

import {UserStore} from '../../stores';
function auth(nextState, replaceState) {
  if (!UserStore.hasUser()){
    replaceState({ nextPathname: nextState.location.pathname }, '/login');
  }
}

const routes = (
  <Route component={Opsee}>
    <Route path="styleguide" component={Styleguide}/>

    <Route path="/env" component={Env} onEnter={auth}/>
    <Route path="/env-groups-security" component={EnvGroupsSecurity} onEnter={auth}/>
    <Route path="/env-groups-elb" component={EnvGroupsELB} onEnter={auth}/>
    <Route path="/env-instances-ec2" component={EnvInstancesEC2} onEnter={auth}/>
    <Route path="/instance/ec2/:id" component={InstanceEC2} onEnter={auth}/>
    <Route path="/instance/rds/:id" component={InstanceRDS} onEnter={auth}/>

    <Route path="/" component={CheckList} onEnter={auth}>
      <IndexRoute component={CheckList}/>
    </Route>
    <Redirect from="/checks" to="/"/>

    <Redirect from="/check-create" to="/check-create/target"/>
    <Route path="/check-create" component={CheckCreate} onEnter={auth}>
      <Route path="/check-create/target" component={CheckCreateTarget}/>
      <Route path="/check-create/request" component={CheckCreateRequest}/>
      <Route path="/check-create/assertions" component={CheckCreateAssertions}/>
      <Route path="/check-create/info" component={CheckCreateInfo}/>
    </Route>
    <Route path="/check/edit/:id" component={CheckEdit} onEnter={auth}/>
    <Route path="/check/:id" component={CheckSingle} onEnter={auth}/>

    <Route path="/group/security/:id" component={GroupSecurity} onEnter={auth}/>
    <Route path="/group/elb/:id" component={GroupELB} onEnter={auth}/>

    <Route path="/start" component={OnboardCreate}/>
    <Route path="/start/thanks" component={OnboardThanks}/>
    <Route path="/start/password" component={OnboardPassword}/>

    <Redirect from="/start/tutorial" to="/start/tutorial/1"/>
    <Route path="/start/tutorial" component={OnboardTutorial} onEnter={auth}>
      <Route path="/start/tutorial/1" component={OnboardTutorial1}/>
      <Route path="/start/tutorial/2" component={OnboardTutorial2}/>
      <Route path="/start/tutorial/3" component={OnboardTutorial3}/>
    </Route>

    <Route path="/start/profile" component={Help} onEnter={auth}/>
    {
    // <Route path="/start/team" component={OnboardTeam} onEnter={auth}/>
    }
    <Route path="/start/region-select" component={OnboardRegionSelect} onEnter={auth}/>
    <Route path="/start/credentials" component={OnboardCredentials} onEnter={auth}/>
    <Route path="/start/vpc-select" component={OnboardVPCSelect} onEnter={auth}/>
    <Route path="/start/install" component={OnboardInstall} onEnter={auth}/>
    <Route path="/start/install-example" component={OnboardInstall} example onEnter={auth}/>

    <Route path="/admin/signups" component={AdminSignups} onEnter={auth}/>
    <Route path="/admin/socket" component={AdminSocket} onEnter={auth}/>
    <Route path="/system" component={System} onEnter={auth}/>

    <Route path="/profile" component={Profile} onEnter={auth}/>
    <Route path="/profile/edit" component={ProfileEdit} onEnter={auth}/>
    <Route path="/login" component={Login}/>
    <Route path="/password-forgot" component={PasswordForgot}/>
    <Route path="/password-change" component={PasswordChange}/>

    <Route path="/help" component={Help}/>

    <Route path="/docs" component={Docs}/>
    <Route path="/docs/bastion" component={DocsBastion}/>
    <Route path="/docs/cloudformation" component={DocsCloudformation}/>
    <Route path="/docs/IAM" component={DocsIAM}/>
    <Route path="/docs/checks" component={DocsChecks}/>

    <Route path="*" component={NotFound}/>
  </Route>
);

export default routes;