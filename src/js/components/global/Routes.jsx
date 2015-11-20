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
import DocsChecks from '../docs/Checks.jsx';

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
  <Route handler={Opsee}>
    <Route path="styleguide" name="styleguide" handler={Styleguide}/>

    <Route path="/env" name="env" handler={Env}/>
    <Route path="/env-groups-security" name="envGroupsSecurity" handler={EnvGroupsSecurity}/>
    <Route path="/env-groups-elb" name="envGroupsELB" handler={EnvGroupsELB}/>
    <Route path="/env-instances-ec2" name="envInstancesEC2" handler={EnvInstancesEC2}/>
    <Route path="/instance/ec2/:id" name="instanceEC2" handler={InstanceEC2}/>
    <Route path="/instance/rds/:id" name="instanceRDS" handler={InstanceRDS}/>

    <Route path="/" name="checks" handler={CheckList}/>
    <Redirect from="/checks" to="/" />

    <Route path="/check-create" name="checkCreate" handler={CheckCreate}>
      <Redirect from="/check-create" to="/check-create/target" />
      <Route path="/check-create/target" name="checkCreateTarget" handler={CheckCreateTarget}/>
      <Route path="/check-create/request" name="checkCreateRequest" handler={CheckCreateRequest}/>
      <Route path="/check-create/assertions" name="checkCreateAssertions" handler={CheckCreateAssertions}/>
      <Route path="/check-create/info" name="checkCreateInfo" handler={CheckCreateInfo}/>
    </Route>
    <Route path="/check/edit/:id" name="checkEdit" handler={CheckEdit}/>
    <Route path="/check/:id" name="check" handler={CheckSingle}>
      <NotFoundRoute handler={CheckNotFound}/>
    </Route>

    <Route path="/group/security/:id" name="groupSecurity" handler={GroupSecurity}/>
    <Route path="/group/elb/:id" name="groupELB" handler={GroupELB}/>

    <Route path="/start" name="start" handler={OnboardCreate}/>
    <Route path="/start/thanks" name="onboardThanks" handler={OnboardThanks}/>
    <Route path="/start/password" name="onboardPassword" handler={OnboardPassword}/>
    <Route path="/start/tutorial" name="tutorial" handler={OnboardTutorial}>
      <Redirect from="/start/tutorial" to="/start/tutorial/1" />
      <Route path="/start/tutorial/1" name="tutorial1" handler={OnboardTutorial1}/>
      <Route path="/start/tutorial/2" name="tutorial2" handler={OnboardTutorial2}/>
      <Route path="/start/tutorial/3" name="tutorial3" handler={OnboardTutorial3}/>
    </Route>
    <Route path="/start/profile" name="onboardProfile" handler={Help}/>
    <Route path="/start/team" name="onboardTeam" handler={OnboardTeam}/>
    <Route path="/start/region-select" name="onboardRegionSelect" handler={OnboardRegionSelect}/>
    <Route path="/start/credentials" name="onboardCredentials" handler={OnboardCredentials}/>
    <Route path="/start/vpc-select" name="onboardVpcSelect" handler={OnboardVPCSelect}/>
    <Route path="/start/install" name="onboardInstall" handler={OnboardInstall}/>
    <Route path="/start/install-example" name="onboardInstallExample" handler={OnboardInstall} example/>

    <Route path="/admin/signups" name="adminSignups" handler={AdminSignups}/>
    <Route path="/admin/socket" name="adminSocket" handler={AdminSocket}/>
    <Route path="/system" name="system" handler={System}/>

    <Route path="/profile" name="profile" handler={Profile}/>
    <Route path="/profile/edit" name="profileEdit" handler={ProfileEdit}/>
    <Route path="/login" name="login" handler={Login}/>
    <Route path="/password-forgot" name="passwordForgot" handler={PasswordForgot}/>
    <Route path="/password-change" name="passwordChange" handler={PasswordChange}/>

    <Route path="/help" name="help" handler={Help}/>

    <Route path="/docs" name="docs" handler={Docs}/>
    <Route path="/docs/bastion" name="docsBastion" handler={DocsBastion}/>
    <Route path="/docs/cloudformation" name="docsCloudformation" handler={DocsCloudformation}/>
    <Route path="/docs/IAM" name="docsIAM" handler={DocsIAM}/>
    <Route path="/docs/checks" name="docsChecks" handler={DocsChecks}/>

    <NotFoundRoute handler={NotFound}/>
  </Route>
);

const hideNavList = ['start', 'onboardThanks', 'onboardPassword', 'tutorial', 'onboardRegionSelect', 'onboardCredentials', 'onboardVpcSelect', 'onboardInstall', 'onboardInstallExample', 'login', 'checkCreateTarget', 'checkCreateRequest', 'checkCreateAssertions', 'checkCreateInfo', 'checkEdit', 'profileEdit', 'passwordForgot'];

export default {
  routes,
  hideNavList
};