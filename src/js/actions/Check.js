import _ from 'lodash';
import config from '../modules/config';
import Flux from '../modules/flux';
import {api} from '../swagger';

let _actions = {};

_actions.checkSilence = Flux.statics.addAction('checkSilence');

_actions.checkCreate = Flux.statics.addAsyncAction('checkCreate',
  (data) => {
    return api.postChecks(data);
  },
  res => res.body,
  res => res && res.body || res
);

export default _.assign({}, ..._.values(_actions));