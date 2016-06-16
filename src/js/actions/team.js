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

// export function getTeam(data) {
//   return (dispatch, state) => {
//     dispatch({
//       type: TEAM_GET,
//       payload: new Promise((resolve, reject) => {
//         resolve({
//           name: 'Furconi',
//           features: ['1 Bastion', '1 User', 'Unlimited Checks'],
//           plan: 'Free',
//           invoices: [
//             {
//               date: 1461401084853,
//               amount: 90.45
//             },
//             {
//               date: 1463603084853,
//               amount: 100.30
//             },
//             {
//               date: 1465801084853,
//               amount: 110.00
//             }
//           ],
//           members: [
//             {
//               name: 'Steve Boak',
//               id: 'falkh3lk43332',
//               email: 'steve@opsee.com',
//               status: 'invited',
//               capabilities: ['billing', 'management', 'editing']
//             },
//             {
//               name: 'Mark Martin',
//               id: '2358y4398t5',
//               email: 'mark@opsee.com',
//               status: 'active',
//               capabilities: ['billing', 'editing']
//             },
//             {
//               name: 'Greg Poirier',
//               id: 'alkfhlk34h431',
//               email: 'greg@opsee.com',
//               status: 'inactive',
//               capabilities: []
//             },
//             {
//               name: undefined,
//               id: 'qrlfhlkhq3elk3255',
//               email: 'dan@opsee.com',
//               status: 'invited',
//               capabilities: []
//             }
//           ]
//         });
//       })
//     });
//   };
// }

export function getTeam(){
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
                perms
              }
            }
          }`
        });
      }, {search: state().search})
    });
  };
}

export function edit(data){
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
                perms
              }
            }
          }`,
          variables: {
            team
          }
        });
      }, {search: state().search}, () => {
        setTimeout(() => {
          dispatch(push('/team'));
        }, 100);
      })
    });
  };
}

// export function memberInvite(data, redirect = false) {
//   return (dispatch, state) => {
//     dispatch({
//       type: TEAM_MEMBER_INVITE,
//       meta: data,
//       payload: new Promise((resolve, reject) => {
//         setTimeout(() => {
//           console.log(data);
//           resolve('ok');
//           if (redirect){
//             setTimeout(() => {
//               dispatch(push('/team'));
//             }, 100);
//           }
//         }, 3000);
//       })
//     });
//   };
// }

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
              perms
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

// export function memberInvite(data){
//   const user = _.chain(data)
//     .assign({
//       id: 0,
//       status: 'invited'
//     })
//     .pick(['perms', 'email', 'id', 'status'])
//     .value();
//   return (dispatch, state) => {
//     dispatch({
//       type: TEAM_MEMBER_INVITE,
//       payload: graphPromise('user', () => {
//         return request
//         .post(`${config.services.compost}`)
//         .set('Authorization', state().user.get('auth'))
//         .send({
//           query: `mutation invite ($user: User){
//             user (user: $user){
//               status
//               perms
//               id
//               email
//               name
//             }
//           }`,
//           variables: {
//             user
//           }
//         });
//       }, {search: state().search}, () => {
//         setTimeout(() => {
//           dispatch(push('/team'));
//         }, 100);
//       })
//     });
//   };
// }

// export function memberEdit(data) {
//   return (dispatch, state) => {
//     dispatch({
//       type: TEAM_MEMBER_EDIT,
//       payload: new Promise((resolve, reject) => {
//         resolve('ok');
//         setTimeout(() => {
//           dispatch(push('/team'));
//         }, 100);
//       })
//     });
//   };
// }