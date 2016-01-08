import React from 'react';
import {Route, Redirect, IndexRoute} from 'react-router';
import Opsee from '../global/Opsee';

import Env from '../env/Env';
import EnvGroupsSecurity from '../env/EnvGroupsSecurity';
import EnvGroupsELB from '../env/EnvGroupsELB';
import EnvInstancesEC2 from '../env/EnvInstancesEC2';
import CheckList from 'react-proxy?name=checks!../checks/List';
import CheckSingle from 'react-proxy?name=checks!../checks/Single';
import CheckEdit from 'react-proxy?name=checks!../checks/Edit';

import Docs from 'react-proxy!../docs/Docs';
import DocsBastion from 'react-proxy!../docs/Bastion';
import DocsCloudformation from 'react-proxy!../docs/Cloudformation';
import DocsIAM from 'react-proxy!../docs/IAM';
import DocsChecks from 'react-proxy!../docs/Checks.jsx';

import CheckCreate from 'react-proxy?name=checkCreate!../checks/Create';
import CheckCreateTarget from 'react-proxy?name=checkCreate!../checks/CheckCreateTarget';
import CheckCreateRequest from 'react-proxy?name=checkCreate!../checks/CheckCreateRequest';
import CheckCreateAssertions from 'react-proxy?name=checkCreate!../checks/CheckCreateAssertions';
import CheckCreateInfo from 'react-proxy?name=checkCreate!../checks/CheckCreateInfo';
import CheckScreenshot from 'react-proxy?name=checkCreate!../checks/Screenshot';

import GroupSecurity from '../groups/GroupSecurity';
import GroupELB from '../groups/GroupElb';

import InstanceEcc from '../instances/InstanceEcc';
import InstanceRDS from '../instances/InstanceRDS';

import Login from '../user/Login';
import PasswordForgot from 'react-proxy?name=password!../user/PasswordForgot';
import PasswordChange from 'react-proxy?name=password!../user/PasswordChange';
import Profile from 'react-proxy?name=profile!../user/Profile';
import ProfileEdit from 'react-proxy?name=profile!../user/ProfileEdit';

import OnboardCreate from 'react-proxy?name=onboard!../onboard/Create';
import OnboardThanks from 'react-proxy?name=onboard!../onboard/Thanks';
import OnboardPassword from 'react-proxy?name=onboard!../onboard/Password';
import OnboardTutorial from 'react-proxy?name=onboard!../onboard/Tutorial';
import OnboardTutorial1 from 'react-proxy?name=onboard!../onboard/Tutorial1';
import OnboardTutorial2 from 'react-proxy?name=onboard!../onboard/Tutorial2';
import OnboardTutorial3 from 'react-proxy?name=onboard!../onboard/Tutorial3';
import OnboardRegionSelect from 'react-proxy?name=onboard!../onboard/RegionSelect';
import OnboardCredentials from 'react-proxy?name=onboard!../onboard/Credentials';
import OnboardVPCSelect from 'react-proxy?name=onboard!../onboard/VPCSelect';
import OnboardSubnetSelect from 'react-proxy?name=onboard!../onboard/SubnetSelect';
import OnboardInstall from 'react-proxy?name=onboard!../onboard/Install';

import AdminSignups from 'react-proxy!../admin/Signups';

import Help from 'react-proxy!../pages/Help';
import Styleguide from 'react-proxy!../pages/Styleguide';
import System from 'react-proxy!../env/System';
import NotFound from 'react-proxy!../pages/NotFound';

import {auth} from '../global/Authenticator';

const routes = (
  <Route component={Opsee}>
    <Route path="styleguide" component={Styleguide}/>

    <Route path="/env" component={auth(Env)}/>
    <Route path="/env-groups-security" component={auth(EnvGroupsSecurity)}/>
    <Route path="/env-groups-elb" component={auth(EnvGroupsELB)}/>
    <Route path="/env-instances-ec2" component={auth(EnvInstancesEC2)}/>
    <Route path="/instance/ec2/:id" component={auth(InstanceEcc)}/>
    <Route path="/instance/rds/:id" component={auth(InstanceRDS)}/>

    <Route path="/" component={auth(CheckList)}>
      <IndexRoute component={CheckList}/>
    </Route>
    <Redirect from="/checks" to="/"/>

    <Redirect from="/check-create" to="/check-create/target"/>
    <Route path="/check-create" component={auth(CheckCreate)}>
      <Route path="/check-create/target" component={CheckCreateTarget}/>
      <Route path="/check-create/request" component={CheckCreateRequest}/>
      <Route path="/check-create/assertions" component={CheckCreateAssertions}/>
      <Route path="/check-create/info" component={CheckCreateInfo}/>
    </Route>
    <Route path="/check/edit/:id" component={auth(CheckEdit)}/>
    <Route path="/check/:id" component={auth(CheckSingle)}/>
    <Route path="/check/:id/screenshot" component={CheckScreenshot}/>

    <Route path="/group/security/:id" component={auth(GroupSecurity)}/>
    <Route path="/group/elb/:id" component={auth(GroupELB)}/>

    <Route path="/start" component={OnboardCreate}/>
    <Route path="/start/thanks" component={OnboardThanks}/>
    <Route path="/start/password" component={OnboardPassword}/>

    <Redirect from="/start/tutorial" to="/start/tutorial/1"/>
    <Route path="/start/tutorial" component={auth(OnboardTutorial)}>
      <Route path="/start/tutorial/1" component={OnboardTutorial1}/>
      <Route path="/start/tutorial/2" component={OnboardTutorial2}/>
      <Route path="/start/tutorial/3" component={OnboardTutorial3}/>
    </Route>

    <Route path="/start/profile" component={auth(Help)}/>
    <Route path="/start/region-select" component={auth(OnboardRegionSelect)}/>
    <Route path="/start/credentials" component={auth(OnboardCredentials)}/>
    <Route path="/start/vpc-select" component={auth(OnboardVPCSelect)}/>
    <Route path="/start/subnet-select" component={auth(OnboardSubnetSelect)}/>
    <Route path="/start/install" component={auth(OnboardInstall)}/>
    <Route path="/start/install-example" component={OnboardInstall} example onEnter={auth}/>

    <Route path="/admin/signups" component={auth(AdminSignups)}/>
    <Route path="/system" component={auth(System)}/>

    <Route path="/profile" component={auth(Profile)}/>
    <Route path="/profile/edit" component={auth(ProfileEdit)}/>
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