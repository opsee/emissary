import React, {PropTypes} from 'react';
import Router from 'react-router';
const Route = Router.Route;
import Opsee from './components/Opsee.jsx';

//pages
import Home from './components/pages/Home.jsx';
import More from './components/pages/More.jsx';
import Styleguide from './components/pages/Styleguide.jsx';
import Checks from './components/pages/Checks.jsx';
import CheckSingle from './components/checks/Single.jsx';
import Group from './components/pages/Group.jsx';
import Instance from './components/pages/Instance.jsx';
import Login from './components/pages/Login.jsx';
import PasswordForgot from './components/pages/PasswordForgot.jsx';
import Onboard from './components/pages/Onboard.jsx';

const RouteHandler = Router.RouteHandler;
const routes = (
  <Route handler={Opsee}>
    <Route path="styleguide" name="styleguide" handler={Styleguide}/>
    <Route path="/" name="home" handler={Home}/>
    <Route path="/instance/:id" name="instance" handler={Instance}/>
    <Route path="/checks" name="checks" handler={Checks}/>
    <Route path="/check/:id" name="check" handler={CheckSingle}/>
    <Route path="/group/:id" name="group" handler={Group}/>
    <Route path="/start" name="start" handler={Onboard}/>
    <Route path="/intro/1" name="tutorial" handler={More}/>

    <Route path="/start/password" name="onboardPassword" handler={More}/>
    <Route path="/start/profile" name="onboardProfile" handler={More}/>
    <Route path="/start/team" name="onboardTeam" handler={More}/>
    <Route path="/start/region-select" name="onboardRegionSelect" handler={More}/>
    <Route path="/start/credentials" name="onboardCredentials" handler={More}/>
    <Route path="/start/vpc-select" name="onboardVpcSelect" handler={More}/>
    <Route path="/start/bastion" name="onboardBastion" handler={More}/>

    <Route path="/admin/signups" name="adminSignups" handler={More}/>
    <Route path="/system-status" name="systemStatus" handler={More}/>

    <Route path="/profile" name="profile" handler={More}/>
    <Route path="/login" name="login" handler={Login}/>
    <Route path="/password-forgot" name="passwordForgot" handler={PasswordForgot}/>

    <Route path="/more" name="more" handler={More}/>
    <Route path="/docs" name="docs" handler={More}/>
  </Route>
);

export default Router.run(routes, Router.HistoryLocation, (Root, state) => {
  React.render(<Root params={state.params}/>, document.body);
});