import {push} from 'redux-router';
import config from '../modules/config';
import request from '../modules/request';
import _ from 'lodash';
import * as analytics from './analytics';
import {
  TEAM_GET,
  TEAM_MEMBER_INVITE,
  TEAM_MEMBER_EDIT
} from './constants';
import storage from '../modules/storage';

export function getTeam(data) {
  return (dispatch, state) => {
    dispatch({
      type: TEAM_GET,
      payload: new Promise((resolve, reject) => {
        resolve({
          name: 'Furconi',
          features: ['1 Bastion', '1 User', 'Unlimited Checks'],
          plan: 'Free',
          invoices: [
            {
              date: 1461401084853,
              amount: 90.45
            },
            {
              date: 1463603084853,
              amount: 100.30
            },
            {
              date: 1465801084853,
              amount: 110.00
            }
          ],
          members: [
            {
              name: 'Steve Boak',
              id: 'falkh3lk43332',
              email: 'steve@opsee.com',
              status: 'invited',
              capabilities: ['billing', 'management', 'editing']
            },
            {
              name: 'Mark Martin',
              id: '2358y4398t5',
              email: 'mark@opsee.com',
              status: 'active',
              capabilities: ['billing', 'editing']
            },
            {
              name: 'Greg Poirier',
              id: 'alkfhlk34h431',
              email: 'greg@opsee.com',
              status: 'inactive',
              capabilities: []
            },
            {
              name: undefined,
              id: 'qrlfhlkhq3elk3255',
              email: 'dan@opsee.com',
              status: 'invited',
              capabilities: []
            }
          ]
        });
      })
    });
  };
}

export function memberInvite(data) {
  return (dispatch, state) => {
    dispatch({
      type: TEAM_MEMBER_INVITE,
      payload: new Promise((resolve, reject) => {
        console.log(data);
        resolve('ok');
        setTimeout(() => {
          dispatch(push('/team'));
        }, 100);
      })
    });
  };
}

export function memberEdit(data) {
  return (dispatch, state) => {
    dispatch({
      type: TEAM_MEMBER_EDIT,
      payload: new Promise((resolve, reject) => {
        resolve('ok');
        setTimeout(() => {
          dispatch(push('/team'));
        }, 100);
      })
    });
  };
}