import Constants from '../Constants';
import Flux from '../Flux';
import request from '../request';
import UserStore from '../stores/User';
import response from '../response';

const actions = Flux.createActions({
  getInstances(data){
    const auth = UserStore.getAuth();
    request
      .get(`${Constants.api}/instances`)
      .set('Authorization', auth)
      .then(res => {
        Flux.actions.getInstancesSuccess(res);
      }).catch(res => {
        response(res).then(Flux.actions.getInstancesError);
      });
    return {
      actionType: 'GET_INSTANCES_PENDING',
      data:data
    }
  },
  getInstance(id){
    const auth = UserStore.getAuth();
    request
      .get(`${Constants.api}/instance/${id}`)
      .set('Authorization', auth)
      .then(res => {
        Flux.actions.getInstanceSuccess(res.body);
      }).catch(err => {
        Flux.actions.getInstanceError(err.response);
      });
    return {
      actionType: 'GET_INSTANCE_PENDING',
      data:id
    }
  },
  getInstanceSuccess(res){
    return {
      actionType: 'GET_INSTANCE_SUCCESS',
      data:res.body
    }
  },
  getInstanceError(res){
    console.log(res);
    return {
      actionType: 'GET_INSTANCE_ERROR',
      data:res.response
    }
  },
  getInstancesSuccess(res){
    return {
      actionType: 'GET_INSTANCES_SUCCESS',
      data:res.body && res.body.instances
    }
  },
  getInstancesError(res){
    console.log(res);
    return {
      actionType: 'GET_INSTANCES_ERROR',
      data:res.response
    }
  }
});

export default actions;