import _ from 'lodash';
import {handleActions} from 'redux-actions';
import {Team, Member} from '../modules/schemas';
import {yeller} from '../modules';
import {List} from 'immutable';
import {
  TEAM_GET,
  TEAM_MEMBER_INVITE,
  TEAM_EDIT
} from '../actions/constants';

const initial = new Team();

const statics = {
  teamFromJS: (action) => {
    const {data} = action.payload;
    const team = _.assign({}, data, {
      users: List(data.users.map(m => new Member(_.assign(m, {
        perms: m.perms || [],
        id: (m.id || '').toString()
      }))))
      // features: List(data.features),
      // invoices: List(data.invoices.map(i => new Map(i)))
    });
    return new Team(team);
  }
};

export default handleActions({
  [TEAM_GET]: {
    next(state, action){
      return statics.teamFromJS(action);
    },
    throw: yeller.reportAction
  },
  [TEAM_MEMBER_INVITE]: {
    next(state){
      return state;
    },
    throw: yeller.reportAction
  },
  [TEAM_EDIT]: {
    next(state, action){
      return statics.teamFromJS(action);
    },
    throw: yeller.reportAction
  }
}, initial);