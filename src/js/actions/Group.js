import Constants from '../Constants';
import Flux from '../Flux';
import request from '../request';
import UserStore from '../stores/User';

const actions = Flux.createActions({
  getGroups:function(data){
    const auth = UserStore.getAuth();
    request
      .get(`${Constants.api}/groups`)
      .set('Authorization', auth)
      .then(res => {
        Flux.actions.getGroupsSuccess(res.body);
      }).catch(err => {
        Flux.actions.getGroupsError(err.response && err.response.text);
      });
    return {
      actionType: 'GET_GROUPS_PENDING',
      data:data
    }
  },
  getGroup:function(id){
    const auth = UserStore.getAuth();
    request
      .get(`${Constants.api}/group/${id}`)
      .set('Authorization', auth)
      .then(res => {
        Flux.actions.getGroupSuccess(res.body);
      }).catch(err => {
        Flux.actions.getGroupError(err.response && err.response.text);
      });
    return {
      actionType: 'GET_GROUP_PENDING',
      data:id
    }
  },
  getGroupSuccess(data){
    return {
      actionType: 'GET_GROUP_SUCCESS',
      data:data
    }
  },
  getGroupError(err){
    return {
      actionType: 'GET_GROUP_ERROR',
      data:err
    }
  },
  getGroupsSuccess(data){
    return {
      actionType: 'GET_GROUPS_SUCCESS',
      data:data && data.groups
    }
  },
  getGroupsError(err){
    return {
      actionType: 'GET_GROUPS_ERROR',
      data:err
    }
  }
});

export default actions;