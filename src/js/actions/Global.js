import Flux from '../modules/flux';
import _ from 'lodash';

let _actions = {};

_actions.globalModalMessage = Flux.statics.addAction('globalModalMessage');

_actions.globalContextMenu = Flux.statics.addAction('globalContextMenu');

_actions.globalModalMessageConsume = Flux.statics.addAction('globalModalMessageConsume');

_actions.globalSetNav = Flux.statics.addAction('globalSetNav');

export default _.assign({}, ..._.values(_actions));