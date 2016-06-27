import {push} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import _ from 'lodash';
import {
  TEAM_GET,
  TEAM_MEMBER_INVITE,
  TEAM_MEMBER_EDIT,
  TEAM_EDIT
} from './constants';
import graphPromise from '../modules/graphPromise';

export function getTeam(callback = () => {}){
  return (dispatch, state) => {
    dispatch({
      type: TEAM_GET,
      payload: graphPromise('team', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `{
            team {
              name
              id
              subscription
              users {
                status
                name
                id
                email
                perms {
                  admin
                  edit
                  billing
                }
              }
            }
          }`
        });
      }, {search: state().search}, callback)
    });
  };
}

export function edit(data, redirect = '/team'){
  const team = _.pick(data, ['name', 'plan', 'stripeToken']);
  return (dispatch, state) => {
    dispatch({
      type: TEAM_EDIT,
      payload: graphPromise('team', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `mutation TEAM_EDIT ($team: Team){
            team (team: $team){
              name
              id
              subscription
              users {
                status
                name
                id
                email
                perms {
                  admin
                  edit
                  billing
                }
              }
            }
          }`,
          variables: {
            team
          }
        });
      }, {search: state().search}, () => {
        setTimeout(() => {
          dispatch(push(redirect));
        }, 100);
      })
    });
  };
}

function member(data, type, redirect = '/team'){
  const user = _.chain(data)
    .assign({
      id: (data.id && parseInt(data.id, 10)) || 0,
      status: data.status || 'invited'
    })
    .pick(['perms', 'email', 'id', 'status'])
    .value();
  return (dispatch, state) => {
    dispatch({
      type,
      payload: graphPromise('user', () => {
        return request
        .post(`${config.services.compost}`)
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `mutation ${type} ($user: User){
            user (user: $user){
              status
              perms {
                admin
                edit
                billing
              }
              id
              email
              name
            }
          }`,
          variables: {
            user
          }
        });
      }, {search: state().search}, () => {
        setTimeout(() => {
          dispatch(push(redirect));
        }, 100);
      })
    });
  };
}

export function memberInvite(data){
  return member(data, TEAM_MEMBER_INVITE);
}

export function memberEdit(data){
  return member(data, TEAM_MEMBER_EDIT, `/team/member/${data.id}`);
}