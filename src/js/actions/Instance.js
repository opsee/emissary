import config from '../modules/config';
import {UserStore} from '../stores';
import Flux from '../modules/flux';
import request from '../modules/request';
import _ from 'lodash';


const getInstances = Flux.statics.addAsyncAction('getInstances',
  () => {
    return request
    .get(`${config.api}/instances`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body && res.body.instances,
  res => res && res.response
);

const getInstance = Flux.statics.addAsyncAction('getInstance', 
  (id) => {
    return request
    .get(`${config.api}/instance/${id}`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => res && res.response
);

export default _.assign({}, getInstances, getInstance);