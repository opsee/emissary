//circular dep here
import config from './config';

const analytics = {
  event(category, action = '', data = {}){
    //data can be a string or object, both will be converted to object and stringified
    if (!category){
      if (config.env !== 'production'){
        return console.warn('No category supplied to analytics event');
      }
      return false;
    }
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);
    const objectData = typeof data === 'string' ? {data} : data;
    window.ga('send', 'event', category, action, stringData);
    window.Intercom('trackEvent', `${category} - ${action}`, objectData);
  }
};

export default analytics;