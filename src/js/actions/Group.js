import Constants from '../Constants';
import Flux from '../Flux';
import request from '../request';
import UserStore from '../stores/User';
import _ from 'lodash';


var getGroups = Flux.statics.addAsyncAction('getGroups',
  () => {
    return request
    .get(`${Constants.api}/groups`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body && res.body.groups, 
  res => res && res.response
);

var getGroup = Flux.statics.addAsyncAction('getGroup', 
  (id) => {
    return request
    .get(`${Constants.api}/group/${id}`)
    .set('Authorization', UserStore.getAuth())
  },
  res => res.body,
  res => res && res.response
);

export default _.assign({}, getGroup, getGroups);