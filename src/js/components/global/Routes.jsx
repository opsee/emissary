import React from 'react';
import {Route, Redirect, IndexRoute} from 'react-router';
import Opsee from '../global/Opsee';

import Env from '../env/Env';
import EnvGroupsSecurity from '../env/EnvGroupsSecurity';
import EnvGroupsASG from '../env/EnvGroupsASG';
import EnvGroupsELB from '../env/EnvGroupsELB';
import EnvInstancesEC2 from '../env/EnvInstancesEC2';
import EnvInstancesRDS from '../env/EnvInstancesRDS';

import CheckList from 'react-proxy?name=checks!exports?exports.default!../checks/List';
import CheckMultiEditNotifications from 'react-proxy?name=checks!exports?exports.default!../checks/MultiEditNotifications';
import CheckSingle from 'react-proxy?name=checks!exports?exports.default!../checks/Single';
import CheckEdit from 'react-proxy?name=checks!exports?exports.default!../checks/Edit';

import DocsBastion from 'react-proxy?name=docsBastion!exports?exports.default!../docs/Bastion';
import DocsIAM from 'react-proxy?name=docsIAM!exports?exports.default!../docs/IAM';
import DocsChecks from 'react-proxy?name=docsChecks!exports?exports.default!../docs/Checks.jsx';
import DocsNotifications from 'react-proxy?name=docsNotifications!exports?exports.default!../docs/Notifications.jsx';
import DocsPermissions from 'react-proxy?name=docsPermissions!exports?exports.default!../docs/Permissions.jsx';

import CheckCreate from 'react-proxy?name=checkCreate!exports?exports.default!../checks/Create';
import CheckCreateTarget from 'react-proxy?name=checkCreate!exports?exports.default!../checks/CheckCreateTarget';
import CheckCreateType from 'react-proxy?name=checkCreate!exports?exports.default!../checks/CheckCreateType';
import CheckCreateRequest from 'react-proxy?name=checkCreate!exports?exports.default!../checks/CheckCreateRequest';
import AssertionsHTTP from 'react-proxy?name=checkCreate!exports?exports.default!../checks/AssertionsHTTP';
import AssertionsCloudwatch from 'react-proxy?name=checkCreate!exports?exports.default!../checks/AssertionsCloudwatch';
import CheckCreateInfo from 'react-proxy?name=checkCreate!exports?exports.default!../checks/CheckCreateInfo';
import CheckEvent from 'react-proxy?name=checkCreate!exports?exports.default!../checks/CheckEvent';

import Slack from '../integrations/Slack';

import GroupSecurity from '../groups/GroupSecurity';
import GroupAsg from '../groups/GroupAsg';
import GroupELB from '../groups/GroupElb';

import InstanceEcc from '../instances/InstanceEcc';
import InstanceRDS from '../instances/InstanceRDS';

import Login from 'react-proxy?name=onboard!exports?exports.default!../user/Login';
import PasswordForgot from 'react-proxy?name=onboard!exports?exports.default!../user/PasswordForgot';
import PasswordChange from 'react-proxy?name=onboard!exports?exports.default!../user/PasswordChange';
import Profile from 'react-proxy?name=profile!exports?exports.default!../user/Profile';
import ProfileEdit from 'react-proxy?name=profile!exports?exports.default!../user/ProfileEdit';
import Team from 'react-proxy?name=team!exports?exports.default!../team/Team';
import TeamEdit from 'react-proxy?name=team!exports?exports.default!../team/TeamEdit';
import TeamMember from 'react-proxy?name=team!exports?exports.default!../team/TeamMember';

import OnboardCreate from 'react-proxy?name=onboard!exports?exports.default!../onboard/Create';
import OnboardThanks from 'react-proxy?name=onboard!exports?exports.default!../onboard/Thanks';
import OnboardPassword from 'react-proxy?name=onboard!exports?exports.default!../onboard/Password';
import OnboardRegionSelect from 'react-proxy?name=onboard!exports?exports.default!../onboard/RegionSelect';
import OnboardVPCSelect from 'react-proxy?name=onboard!exports?exports.default!../onboard/VPCSelect';
import OnboardSubnetSelect from 'react-proxy?name=onboard!exports?exports.default!../onboard/SubnetSelect';
import OnboardInstall from 'react-proxy?name=onboard!exports?exports.default!../onboard/Install';

import OnboardLaunchStack from 'react-proxy?name=onboard!exports?exports.default!../onboard/LaunchStack';
import OnboardAddInstance from 'react-proxy?name=onboard!exports?exports.default!../onboard/AddInstance';

import SearchAll from 'react-proxy?name=search!exports?exports.default!../search/All';

import Help from 'react-proxy?name=help!exports?exports.default!../pages/Help';
import Styleguide from 'react-proxy?name=styleguide!exports?exports.default!../pages/Styleguide';
import System from 'react-proxy?name=system!exports?exports.default!../env/System';
import TOS from 'react-proxy?name=tos!exports?exports.default!../pages/TOS';
import NotFound from 'react-proxy?name=notfound!exports?exports.default!../pages/NotFound';

import {auth} from '../global/Authenticator';

const routes = (
  <Route component={Opsee}>
    <Route path="styleguide" component={auth(Styleguide, true)}/>

    <Route path="/env" component={auth(Env)}/>
    <Redirect from="/groups-security" to="/env-groups-security"/>
    <Route path="/env-groups-security" component={auth(EnvGroupsSecurity)}/>
    <Redirect from="/groups-elb" to="/env-groups-elb"/>
    <Route path="/env-groups-elb" component={auth(EnvGroupsELB)}/>
    <Route path="/env-groups-asg" component={auth(EnvGroupsASG)}/>
    <Redirect from="/instances-ecc" to="/env-instances-ec2"/>
    <Redirect from="/instances-ec2" to="/env-instances-ec2"/>
    <Route path="/env-instances-ecc" component={auth(EnvInstancesEC2)}/>
    <Route path="/env-instances-ec2" component={auth(EnvInstancesEC2)}/>
    <Redirect from="/instances-rds" to="/env-instances-rds"/>
    <Route path="/env-instances-rds" component={auth(EnvInstancesRDS)}/>
    <Route path="/instance/ecc/:id" component={auth(InstanceEcc)}/>
    <Route path="/instance/ec2/:id" component={auth(InstanceEcc)}/>
    <Route path="/instance/rds/:id" component={auth(InstanceRDS)}/>

    <Route path="/" component={auth(CheckList)}>
      <IndexRoute component={CheckList}/>
    </Route>
    <Redirect from="/checks" to="/"/>
    <Route path="/checks-notifications" component={auth(CheckMultiEditNotifications)}/>

    <Redirect from="/check-create" to="/check-create/type"/>
    <Route path="/check-create" component={auth(CheckCreate)}>
      <Route path="/check-create/type" component={CheckCreateType}/>
      <Route path="/check-create/target" component={CheckCreateTarget}/>
      <Route path="/check-create/request" component={CheckCreateRequest}/>
      <Route path="/check-create/assertions" component={AssertionsHTTP}/>
      <Route path="/check-create/assertions-cloudwatch" component={AssertionsCloudwatch}/>
      <Route path="/check-create/info" component={CheckCreateInfo}/>
    </Route>
    <Route path="/check/edit/:id" component={auth(CheckEdit)}/>
    <Route path="/check/:id/event" component={auth(CheckEvent)}/>
    <Route path="/check/:id" component={auth(CheckSingle)}/>

    <Route path="/group/security/:id" component={auth(GroupSecurity)}/>
    <Route path="/group/asg/:id" component={auth(GroupAsg)}/>
    <Route path="/group/elb/:id" component={auth(GroupELB)}/>

    <Redirect from="/start/tutorial" to="/start/launch-stack"/>
    <Redirect from="/start/tutorial/1" to="/start/launch-stack"/>
    <Redirect from="/start/tutorial/2" to="/start/launch-stack"/>
    <Redirect from="/start/tutorial/3" to="/start/launch-stack"/>
    <Route path="/start" component={OnboardCreate}/>
    <Route path="/start/thanks" component={OnboardThanks}/>
    <Route path="/start/password" component={OnboardPassword}/>
    <Route path="/start/launch-stack" component={auth(OnboardLaunchStack)} />
    <Route path="/start/choose-region" component={auth(OnboardRegionSelect)} />
    <Route path="/start/add-instance" component={OnboardAddInstance} />
    <Route path="/start/choose-vpc" component={auth(OnboardVPCSelect)}/>
    <Route path="/start/choose-subnet" component={auth(OnboardSubnetSelect)}/>
    <Route path="/start/install" component={auth(OnboardInstall)}/>
    <Route path="/start/install-example" component={OnboardInstall} example onEnter={auth}/>
    <Route path="/start/profile" component={auth(Help)}/>

    <Route path="/system" component={auth(System)}/>

    <Route path="/search" component={auth(SearchAll)}/>

    <Route path="/profile" component={auth(Profile)}/>
    <Route path="/profile/edit" component={auth(ProfileEdit)}/>
    <Route path="/team" component={auth(Team)}/>
    <Route path="/team/edit" component={auth(TeamEdit)}/>
    <Route path="/team/member/:id" component={auth(TeamMember)}/>
    <Route path="/login" component={Login}/>
    <Route path="/password-forgot" component={PasswordForgot}/>
    <Route path="/password-change" component={PasswordChange}/>

    <Route path="/help" component={Help}/>

    <Redirect from="/docs" to="/help"/>
    <Route path="/docs/bastion" component={DocsBastion}/>
    <Route path="/docs/IAM" component={DocsIAM}/>
    <Route path="/docs/checks" component={DocsChecks}/>
    <Route path="/docs/notifications" component={DocsNotifications}/>
    <Route path="/docs/permissions" component={DocsPermissions}/>

    <Route path="/integrations/slack" component={Slack}/>

    <Route path="/tos" component={TOS}/>

    <Route path="*" component={NotFound}/>
  </Route>
);

export default routes;
