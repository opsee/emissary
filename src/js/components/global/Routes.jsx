import React, {PropTypes} from 'react';
import Router from 'react-router';
const Route = Router.Route;
import Opsee from '../global/Opsee.jsx';
import NotFoundRoute from 'react-router/lib/components/NotFoundRoute';
import DefaultRoute from 'react-router/lib/components/DefaultRoute';
import Redirect from 'react-router/lib/components/Redirect';

//pages
import Home from '../pages/Home.jsx';
import HomeInstances from '../pages/HomeInstances.jsx';
import HomeGroups from '../pages/HomeGroups.jsx';
import More from '../pages/More.jsx';
import Styleguide from '../pages/Styleguide.jsx';
import CheckList from '../checks/List.jsx';
import CheckSingle from '../checks/Single.jsx';
import CheckEdit from '../checks/Edit.jsx';
import CheckCreate from '../checks/Create.jsx';
import Docs from '../docs/Docs.jsx';
import DocsBastion from '../docs/Bastion.jsx';
import DocsCloudformation from '../docs/Cloudformation.jsx';

import CheckStep1 from '../checks/CheckStep1.jsx';
import CheckStep2 from '../checks/CheckStep2.jsx';
import CheckStep3 from '../checks/CheckStep3.jsx';

import CheckNotFound from '../checks/NotFound.jsx';
import Group from '../pages/Group.jsx';
import Instance from '../pages/Instance.jsx';

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

import NotFound from '../pages/NotFound.jsx';

const RouteHandler = Router.RouteHandler;
const routes = (
  <Route handler={Opsee}>
    <Route path="styleguide" name="styleguide" handler={Styleguide}/>
    <Route path="/" name="home" handler={Home}>
      <Redirect from="/" to="/home/instances" />
      <Route path="/home/instances" name="homeInstances" handler={HomeInstances}/>
      <Route path="/home/groups" name="homeGroups" handler={HomeGroups}/>
    </Route>
    <Route path="/instance/:id" name="instance" handler={Instance}/>

    <Route path="/checks" name="checks" handler={CheckList}/>
    <Route path="/check-create" name="checkCreate" handler={CheckCreate}>
      <Redirect from="/check-create" to="/check-create-step-1" />
      <Route path="/check-create-step-1" name="checkCreateStep1" handler={CheckStep1}/>
      <Route path="/check-create-step-2" name="checkCreateStep2" handler={CheckStep2}/>
      <Route path="/check-create-step-3" name="checkCreateStep3" handler={CheckStep3}/>
    </Route>
    <Route path="/check/edit/:id" name="checkEdit" handler={CheckEdit}/>
    <Route path="/check/:id" name="check" handler={CheckSingle}>
      <NotFoundRoute handler={CheckNotFound}/>
    </Route>

    <Route path="/group/:id" name="group" handler={Group}/>

    <Route path="/start" name="start" handler={OnboardCreate}/>
    <Route path="/start/thanks" name="onboardThanks" handler={OnboardThanks}/>
    <Route path="/start/password" name="onboardPassword" handler={OnboardPassword}/>
    <Route path="/start/tutorial" name="tutorial" handler={OnboardTutorial}>
      <Redirect from="/start/tutorial" to="/start/tutorial/1" />
      <Route path="/start/tutorial/1" name="tutorial1" handler={OnboardTutorial1}/>
      <Route path="/start/tutorial/2" name="tutorial2" handler={OnboardTutorial2}/>
      <Route path="/start/tutorial/3" name="tutorial3" handler={OnboardTutorial3}/>
    </Route>
    <Route path="/start/profile" name="onboardProfile" handler={More}/>
    <Route path="/start/team" name="onboardTeam" handler={OnboardTeam}/>
    <Route path="/start/region-select" name="onboardRegionSelect" handler={OnboardRegionSelect}/>
    <Route path="/start/credentials" name="onboardCredentials" handler={OnboardCredentials}/>
    <Route path="/start/vpc-select" name="onboardVpcSelect" handler={OnboardVPCSelect}/>
    <Route path="/start/install" name="onboardInstall" handler={OnboardInstall}/>
    <Route path="/start/install-example" name="onboardInstallExample" handler={OnboardInstall} example={true}/>

    <Route path="/admin/signups" name="adminSignups" handler={AdminSignups}/>
    <Route path="/admin/socket" name="adminSocket" handler={AdminSocket}/>
    <Route path="/system-status" name="systemStatus" handler={More}/>

    <Route path="/profile" name="profile" handler={Profile}/>
    <Route path="/profile/edit" name="profileEdit" handler={ProfileEdit}/>
    <Route path="/login" name="login" handler={Login}/>
    <Route path="/password-forgot" name="passwordForgot" handler={PasswordForgot}/>
    <Route path="/password-change" name="passwordChange" handler={PasswordChange}/>

    <Route path="/more" name="more" handler={More}/>

    <Route path="/docs" name="docs" handler={Docs}/>
    <Route path="/docs/bastion" name="docsBastion" handler={DocsBastion}/>
    <Route path="/docs/cloudformation" name="docsCloudformation" handler={DocsCloudformation}/>

    <NotFoundRoute handler={NotFound}/>
  </Route>
);

const hideNavList = ['start', 'onboardThanks', 'onboardPassword', 'tutorial', 'onboardRegionSelect', 'onboardCredentials', 'onboardVpcSelect', 'onboardInstall', 'onboardInstallExample', 'login'];

export default {
  routes,
  hideNavList
}