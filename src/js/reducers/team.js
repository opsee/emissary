import storage from '../modules/storage';
import _ from 'lodash';
import {handleActions} from 'redux-actions';
import moment from 'moment';
import config from '../modules/config';
import {Team, Member} from '../modules/schemas';
import {yeller} from '../modules';
import {List, Map} from 'immutable';
import {
  TEAM_GET
} from '../actions/constants';

const initial = new Team();

export default handleActions({
  [TEAM_GET]: {
    next(state, action){
      const {payload} = action;
      const team = _.assign({}, payload, {
        members: List(payload.members.map(m => new Member(m))),
        features: List(payload.features),
        invoices: List(payload.invoices.map(i => new Map(i)))
      });
      return new Team(team);
    }
  }
}, initial);