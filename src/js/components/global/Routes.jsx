import React from 'react';
import Router from 'react-router';
const Route = Router.Route;
import Opsee from '../global/Opsee.jsx';
import NotFoundRoute from 'react-router/lib/components/NotFoundRoute';
import Redirect from 'react-router/lib/components/Redirect';

import Env from '../env/Env.jsx';
import EnvGroupsSecurity from '../env/EnvGroupsSecurity.jsx';
import EnvGroupsELB from '../env/EnvGroupsELB.jsx';
import EnvInstancesEC2 from '../env/EnvInstancesEC2.jsx';
import CheckList from '../checks/List.jsx';
import CheckSingle from '../checks/Single.jsx';
import CheckEdit from '../checks/Edit.jsx';
import CheckCreate from '../checks/Create.jsx';

import Docs from '../docs/Docs.jsx';
import DocsBastion from '../docs/Bastion.jsx';
import DocsCloudformation from '../docs/Cloudformation.jsx';
import DocsIAM from '../docs/IAM.jsx';

import CheckCreateTarget from '../checks/CheckCreateTarget.jsx';
import CheckCreateRequest from '../checks/CheckCreateRequest.jsx';
import CheckCreateAssertions from '../checks/CheckCreateAssertions.jsx';
import CheckCreateInfo from '../checks/CheckCreateInfo.jsx';
import CheckNotFound from '../checks/NotFound.jsx';

import GroupSecurity from '../groups/GroupSecurity.jsx';
import GroupELB from '../groups/GroupElb.jsx';

import InstanceEC2 from '../instances/InstanceEC2.jsx';
import InstanceRDS from '../instances/InstanceRDS.jsx';

import Login from '../user/Login.jsx';
import PasswordForgot from '../user/PasswordForgot.jsx';
import PasswordChange from '../user/PasswordChange.jsx';
import Profile from '../user/Profile.jsx';
import ProfileEdit from '../user/ProfileEdit.jsx';

import OnboardCreate from '../onboard/Create.jsx';
import OnboardThanks from '../onboard/Thanks.jsx';
import OnboardPassword from '../onboard/Password.jsx';
import OnboardTutorial from '../onboard/Tutorial.jsx';
import OnboardTutorial1 from '../onboard/Tutorial1.jsx';
import OnboardTutorial2 from '../onboard/Tutorial2.jsx';
import OnboardTutorial3 from '../onboard/Tutorial3.jsx';
import OnboardTeam from '../onboard/Team.jsx';
import OnboardRegionSelect from '../onboard/RegionSelect.jsx';
import OnboardCredentials from '../onboard/Credentials.jsx';
import OnboardVPCSelect from '../onboard/VPCSelect.jsx';
import OnboardInstall from '../onboard/Install.jsx';

import AdminSignups from '../admin/Signups.jsx';
import AdminSocket from '../admin/Socket.jsx';

import Help from '../pages/Help.jsx';
import Styleguide from '../pages/Styleguide.jsx';
import NotFound from '../pages/NotFound.jsx';
import System from '../env/System.jsx';

const routes = (
  <Route component={Opsee}>
    <Route path="styleguide" component={Styleguide}/>

    <Route path="/env" component={Env}/>
    <Route path="/env-groups-security" component={EnvGroupsSecurity}/>
    <Route path="/env-groups-elb" component={EnvGroupsELB}/>
    <Route path="/env-instances-ec2" component={EnvInstancesEC2}/>
    <Route path="/instance/ec2/:id" component={InstanceEC2}/>
    <Route path="/instance/rds/:id" component={InstanceRDS}/>

    <Route path="/" component={CheckList}/>
    <Redirect from="/checks" to="/" />

    <Route path="/check-create" component={CheckCreate}>
      <Redirect from="/check-create" to="/check-create/target" />
      <Route path="/check-create/target" component={CheckCreateTarget}/>
      <Route path="/check-create/request" component={CheckCreateRequest}/>
      <Route path="/check-create/assertions" component={CheckCreateAssertions}/>
      <Route path="/check-create/info" component={CheckCreateInfo}/>
    </Route>
    <Route path="/check/edit/:id" component={CheckEdit}/>
    <Route path="/check/:id" component={CheckSingle}>
      <NotFoundRoute component={CheckNotFound}/>
    </Route>

    <Route path="/group/security/:id" component={GroupSecurity}/>
    <Route path="/group/elb/:id" component={GroupELB}/>

    <Route path="/start" component={OnboardCreate}/>
    <Route path="/start/thanks" component={OnboardThanks}/>
    <Route path="/start/password" component={OnboardPassword}/>
    <Route path="/start/tutorial" component={OnboardTutorial}>
      <Redirect from="/start/tutorial" to="/start/tutorial/1" />
      <Route path="/start/tutorial/1" component={OnboardTutorial1}/>
      <Route path="/start/tutorial/2" component={OnboardTutorial2}/>
      <Route path="/start/tutorial/3" component={OnboardTutorial3}/>
    </Route>
    <Route path="/start/profile" component={Help}/>
    <Route path="/start/team" component={OnboardTeam}/>
    <Route path="/start/region-select" component={OnboardRegionSelect}/>
    <Route path="/start/credentials" component={OnboardCredentials}/>
    <Route path="/start/vpc-select" component={OnboardVPCSelect}/>
    <Route path="/start/install" component={OnboardInstall}/>
    <Route path="/start/install-example" component={OnboardInstall} example/>

    <Route path="/admin/signups" component={AdminSignups}/>
    <Route path="/admin/socket" component={AdminSocket}/>
    <Route path="/system" component={System}/>

    <Route path="/profile" component={Profile}/>
    <Route path="/profile/edit" component={ProfileEdit}/>
    <Route path="/login" component={Login}/>
    <Route path="/password-forgot" component={PasswordForgot}/>
    <Route path="/password-change" component={PasswordChange}/>

    <Route path="/help" component={Help}/>

    <Route path="/docs" component={Docs}/>
    <Route path="/docs/bastion" component={DocsBastion}/>
    <Route path="/docs/cloudformation" component={DocsCloudformation}/>
    <Route path="/docs/IAM" component={DocsIAM}/>

    <NotFoundRoute component={NotFound}/>
  </Route>
);

const hideNavList = ['start', 'onboardThanks', 'onboardPassword', 'tutorial', 'onboardRegionSelect', 'onboardCredentials', 'onboardVpcSelect', 'onboardInstall', 'onboardInstallExample', 'login', 'checkCreateTarget', 'checkCreateRequest', 'checkCreateAssertions', 'checkCreateInfo', 'checkEdit', 'profileEdit', 'passwordForgot'];

export default {
  routes,
  hideNavList
};