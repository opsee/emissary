//circular dep here
import config from './config';

const analytics = {
  event(category, action = '', data = {}){
    if (config.ghosting){
      return false;
    }
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
    if (window.ldclient){
      window.ldclient.track(`${category} - ${action}`, objectData);
    }
  },
  pageView(page, name){
    if (config.ghosting){
      return false;
    }
    const title = name || document.title;
    setTimeout(() => {
      window.ga('send', 'pageview', {page, title});
    }, 0);
  }
};

export default analytics;