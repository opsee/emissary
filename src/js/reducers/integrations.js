import _ from 'lodash';
import {fromJS, List} from 'immutable';
import {handleActions} from 'redux-actions';
import {
  INTEGRATIONS_SLACK_CHANNELS
} from '../actions/constants';

const initial = {
  slackChannels: new List()
};

export default handleActions({
  [INTEGRATIONS_SLACK_CHANNELS]: {
    next(state, action){
      const slackChannels = new List(action.payload);
      return _.assign({}, state, {slackChannels});
    }
  }
}, initial);