//circular dep here
import UserStore from '../stores/User';
import _ from 'lodash';
import config from './config';
const ga = window.ga;
const intercom = window.Intercom;

const analytics = {
  event(category, action, data = {}){
    //data can be a string or object, both will be converted to object and stringified
    if (!category && config.env !== 'production'){
      return console.warn('No category supplied to analytics event');
    }
    const time = Math.round(Date.now() / 1000);
    const email = UserStore.getUser().get('email');
    const meta = typeof data === 'string' ? {data} : data;
    ga('send', 'event', category, action, JSON.stringify(data));
    intercom('trackEvent', category, time, null, email, _.assign(meta, {action}));
  }
};

export default analytics;