import config from '../modules/config';
import Flux from '../modules/flux';
import request from '../modules/request';
import _ from 'lodash';
import {auth} from '../swagger';
import {UserStore} from '../stores';

let _actions = {};

_actions.docsGetCloudFormationTemplate = Flux.statics.addAsyncAction('docsGetCloudFormationTemplate',
  (data) => {
    return request
    .get(`/files/CloudFormationTemplate.json`)
    .send(data)
  },
  res => res && res.body,
  res => res && res.response
);

// _actions.userSet = Flux.statics.addAction('userSet');

export default _.assign({}, ..._.values(_actions));