import _ from 'lodash';
import config from '../modules/config';
import Flux from '../modules/flux';
import {api} from '../swagger';
import request from '../modules/request';
import {UserStore} from '../stores';

let _actions = {};

_actions.checkSilence = Flux.statics.addAction('checkSilence');

_actions.checkCreate = Flux.statics.addAsyncAction('checkCreate',
  (data) => {
    return request
    .post(`${config.api}/checks`)
    .set('Authorization', UserStore.getAuth())
    .send({
      target:{
        id:data.group
      },
      check_spec:{
        type_url:'HttpCheck',
        value:{
          name:data.name,
          path:data.path,
          protocol:data.protocol,
          port:data.port,
          verb:data.method,
          interval:'5m',
          headers:data.headers.map(h => {
            return {
              name:h.key,
              values:[h.value]
            }
          })
        }
      }
    });
  },
  res => res.body,
  res => res && res.body || res
);

_actions.getCheck = Flux.statics.addAsyncAction('getCheck',
  (id) => {
    return request
    .get(`${config.api}/checks/${id}`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => res && res.body || res
);

_actions.getChecks = Flux.statics.addAsyncAction('getChecks',
  (id) => {
    return request
    .get(`${config.api}/checks`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => res && res.body || res
);

// _actions.checkCreate = Flux.statics.addAsyncAction('checkCreate',
//   (data) => {
//     return api.postChecks({Check:data});
//   },
//   res => res.body,
//   res => res && res.body || res
// );

export default _.assign({}, ..._.values(_actions));