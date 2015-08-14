import React, {PropTypes} from 'react';
import Router from 'react-router';
const Route = Router.Route;
import Opsee from './components/Opsee.jsx';
import NotFoundRoute from 'react-router/lib/components/NotFoundRoute';
import DefaultRoute from 'react-router/lib/components/DefaultRoute';
import Redirect from 'react-router/lib/components/Redirect';

//pages
import Home from './components/pages/Home.jsx';
import HomeInstances from './components/pages/HomeInstances.jsx';
import HomeGroups from './components/pages/HomeGroups.jsx';
import More from './components/pages/More.jsx';
import Styleguide from './components/pages/Styleguide.jsx';
import Checks from './components/pages/Checks.jsx';
import CheckSingle from './components/checks/Single.jsx';
import CheckEdit from './components/checks/Edit.jsx';
import CheckCreate from './components/checks/Create.jsx';

import CheckStep1 from './components/checks/CheckStep1.jsx';
import CheckStep2 from './components/checks/CheckStep2.jsx';
import CheckStep3 from './components/checks/CheckStep3.jsx';

import CheckNotFound from './components/checks/NotFound.jsx';
import Group from './components/pages/Group.jsx';
import Instance from './components/pages/Instance.jsx';

import Login from './components/pages/Login.jsx';
import PasswordForgot from './components/pages/PasswordForgot.jsx';
import Profile from './components/pages/Profile.jsx';

import OnboardCreate from './components/onboard/Create.jsx';
import OnboardThanks from './components/onboard/Thanks.jsx';
import OnboardPassword from './components/onboard/Password.jsx';
import OnboardTutorial from './components/onboard/Tutorial.jsx';
import OnboardTutorial1 from './components/onboard/Tutorial1.jsx';
import OnboardTutorial2 from './components/onboard/Tutorial2.jsx';
import OnboardTeam from './components/onboard/Team.jsx';

import AdminSignups from './components/admin/Signups.jsx';

import NotFound from './components/pages/NotFound.jsx';

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

    <Route path="/checks" name="checks" handler={Checks}/>
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
    </Route>
    <Route path="/start/profile" name="onboardProfile" handler={More}/>
    <Route path="/start/team" name="onboardTeam" handler={OnboardTeam}/>
    <Route path="/start/region-select" name="onboardRegionSelect" handler={More}/>
    <Route path="/start/credentials" name="onboardCredentials" handler={More}/>
    <Route path="/start/vpc-select" name="onboardVpcSelect" handler={More}/>
    <Route path="/start/bastion" name="onboardBastion" handler={More}/>

    <Route path="/admin/signups" name="adminSignups" handler={AdminSignups}/>
    <Route path="/system-status" name="systemStatus" handler={More}/>

    <Route path="/profile" name="profile" handler={Profile}/>
    <Route path="/login" name="login" handler={Login}/>
    <Route path="/password-forgot" name="passwordForgot" handler={PasswordForgot}/>

    <Route path="/more" name="more" handler={More}/>
    <Route path="/docs" name="docs" handler={More}/>

    <NotFoundRoute handler={NotFound}/>
  </Route>
);

export default routes;