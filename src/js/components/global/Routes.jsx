import React from 'react';
import {Route, Redirect} from 'react-router';
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

import CheckCreateTarget from '../checks/CheckCreateTarget';
import CheckCreateRequest from '../checks/CheckCreateRequest';
import CheckCreateAssertions from '../checks/CheckCreateAssertions';
import CheckCreateInfo from '../checks/CheckCreateInfo';
import CheckNotFound from '../checks/NotFound';

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
import OnboardTeam from '../onboard/Team';
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
    <Redirect from="/checks" to="/"/>

    <Route path="/check-create" component={CheckCreate}>
      <Redirect from="/check-create" to="/check-create-target"/>
      <Route path="/check-create/target" component={CheckCreateTarget}/>
      <Route path="/check-create/request" component={CheckCreateRequest}/>
      <Route path="/check-create/assertions" component={CheckCreateAssertions}/>
      <Route path="/check-create/info" component={CheckCreateInfo}/>
    </Route>
    <Route path="/check/edit/:id" component={CheckEdit}/>
    <Route path="/check/:id" component={CheckSingle}/>

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

    <Route path="*" component={NotFound}/>
  </Route>
);

const hideNavList = ['start', 'onboardThanks', 'onboardPassword', 'tutorial', 'onboardRegionSelect', 'onboardCredentials', 'onboardVpcSelect', 'onboardInstall', 'onboardInstallExample', 'login', 'checkCreateTarget', 'checkCreateRequest', 'checkCreateAssertions', 'checkCreateInfo', 'checkEdit', 'profileEdit', 'passwordForgot'];

export default {
  routes,
  hideNavList
};