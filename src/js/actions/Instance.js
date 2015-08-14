import constants from '../constants';
import Flux from '../Flux';
import request from '../request';
import UserStore from '../stores/User';
import _ from 'lodash';


var getInstances = Flux.statics.addAsyncAction('getInstances',
  () => {
    return request
    .get(`${constants.api}/instances`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body && res.body.instances,
  res => res && res.response
);

var getInstance = Flux.statics.addAsyncAction('getInstance', 
  (id) => {
    return request
    .get(`${constants.api}/instance/${id}`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => res && res.response
);

export default _.assign({}, getInstances, getInstance);