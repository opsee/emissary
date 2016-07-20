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
import storage from '../modules/storage';

const statics = {
  teamFromJS: (data = {}) => {
    const team = _.assign({}, data, {
      users: new List((data.users || []).map(m => new Member(_.assign(m, {
        perms: m.perms || {},
        id: (m.id || '').toString(),
        status: m.status || 'active'
      }))))
      // features: List(data.features),
      // invoices: List(data.invoices.map(i => new Map(i)))
    });
    return new Team(team);
  }
};

const initial = new Team(statics.teamFromJS(storage.get('team') || {}));

export default handleActions({
  [TEAM_GET]: {
    next(state, action){
      const team = statics.teamFromJS(action.payload.data);
      storage.set('team', team.toJS());
      return team;
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
      const team = statics.teamFromJS(action.payload.data);
      storage.set('team', team.toJS());
      return team;
    },
    throw: yeller.reportAction
  }
}, initial);