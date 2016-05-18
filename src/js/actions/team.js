import {push} from 'redux-router';
import {createAction} from 'redux-actions';
import config from '../modules/config';
import request from '../modules/request';
import _ from 'lodash';
import * as analytics from './analytics';
import {
  GET_TEAM
} from './constants';
import storage from '../modules/storage';

export function getTeam(data) {
  return (dispatch, state) => {
    dispatch({
      type: GET_TEAM,
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
            }
          ]
        });
      })
    });
  };
}