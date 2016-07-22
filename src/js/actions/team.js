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
import * as onboard from './onboard';

export function getTeam(callback = () => {}){
  return (dispatch, state) => {
    dispatch({
      type: TEAM_GET,
      payload: graphPromise('team', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: TEAM_GET})
        .set('Authorization', state().user.get('auth'))
        .send({
          query: `{
            team {
              name
              id
              subscription_plan
              subscription_status
              subscription_quantity
              next_invoice {
                amount
                date
                paid
              }
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
  let team = _.pick(data, ['name', 'plan', 'stripeToken', 'subscription_plan']);
  team = _.mapKeys(team, (value, key) => {
    return key === 'subscription_plan' ? 'plan' : key;
  });
  return (dispatch, state) => {
    dispatch({
      type: TEAM_EDIT,
      payload: graphPromise('team', () => {
        return request
        .post(`${config.services.compost}`)
        .query({type: TEAM_EDIT})
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
        if (data.notifications && data.notifications.length){
          onboard.setDefaultNotifications(data.notifications)(dispatch, state);
        }
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
        .query({type})
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