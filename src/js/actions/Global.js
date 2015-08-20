import constants from '../constants';
import Flux from '../Flux';
import request from '../request';
import UserStore from '../stores/User';
import _ from 'lodash';

let _actions = {};

_actions.globalModalMessage = Flux.statics.addAction('globalModalMessage');

export default _.assign({}, ..._.values(_actions));