import config from '../config';
import Flux from '../Flux';

const actions = Flux.createActions({
  silence(id, length = 1, unit = 'm'){
    return {
      actionType: 'CHECK_SILENCE',
      data:{id, length, unit}
    }
  }
});

export default actions;