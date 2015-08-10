import Constants from '../Constants';
import Flux from '../Flux';
import request from '../request';
import UserStore from '../stores/UserStore';

const actions = Flux.createActions({
  getInstances:function(data){
    const auth = UserStore.getAuth();
    request
      .get(`${Constants.api}/instances`)
      .set('Authorization', auth)
      .then(res => {
        Flux.actions.getInstancesSuccess(res.body);
      }).catch(err => {
        Flux.actions.getInstancesError(err.response && err.response.text);
      });
    return {
      actionType: 'GET_INSTANCES_PENDING',
      data:data
    }
  },
  getInstance:function(id){
    const auth = UserStore.getAuth();
    request
      .get(`${Constants.api}/instance/${id}`)
      .set('Authorization', auth)
      .then(res => {
        Flux.actions.getInstanceSuccess(res.body);
      }).catch(err => {
        Flux.actions.getInstanceError(err.response && err.response.text);
      });
    return {
      actionType: 'GET_INSTANCE_PENDING',
      data:id
    }
  },
  getInstanceSuccess(data){
    return {
      actionType: 'GET_INSTANCE_SUCCESS',
      data:data
    }
  },
  getInstanceError(err){
    return {
      actionType: 'GET_INSTANCE_ERROR',
      data:err
    }
  },
  getInstancesSuccess(data){
    return {
      actionType: 'GET_INSTANCES_SUCCESS',
      data:data && data.instances
    }
  },
  getInstancesError(err){
    return {
      actionType: 'GET_INSTANCES_ERROR',
      data:err
    }
  }
});

export default actions;