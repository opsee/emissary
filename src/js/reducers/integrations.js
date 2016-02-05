import _ from 'lodash';
import {List} from 'immutable';
import {handleActions} from 'redux-actions';

import {yeller} from '../modules';
import {
  INTEGRATIONS_SLACK_ACCESS,
  INTEGRATIONS_SLACK_CHANNELS,
  INTEGRATIONS_SLACK_INFO
} from '../actions/constants';

const initial = {
  slackChannels: new List(),
  slackInfo: {}
};

export default handleActions({
  [INTEGRATIONS_SLACK_ACCESS]: {
    next(state){
      return state;
    },
    throw: yeller.reportAction
  },
  [INTEGRATIONS_SLACK_INFO]: {
    next(state, action){
      const slackInfo = action.payload;
      return _.assign({}, state, {slackInfo});
    }
  },
  [INTEGRATIONS_SLACK_CHANNELS]: {
    next(state, action){
      const slackChannels = new List(action.payload);
      return _.assign({}, state, {slackChannels});
    }
  }
}, initial);