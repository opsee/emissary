import Constants from '../Constants';
import Flux from '../Flux';
import request from '../request';
import UserStore from '../stores/User';
import response from '../response';
import _ from 'lodash';


var getInstances = Flux.statics.addAsyncAction('getInstances',
  () => {
    return request
    .get(`${Constants.api}/instances`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body && res.body.instances,
  res => res && res.response
);

var getInstance = Flux.statics.addAsyncAction('getInstance', 
  (id) => {
    return request
    .get(`${Constants.api}/instance/${id}`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => res && res.response
);

export default _.assign({}, getInstances, getInstance);