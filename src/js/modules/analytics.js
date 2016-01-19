import config from './config'; //circular dep here
import request from './request';
import URL from 'url';

const ANALYTICS_CONFIG = config.services.analytics;
const ANALYTICS_API = URL.format(ANALYTICS_CONFIG);

const analytics = {
  event(category, action = '', data = {}){
    if (config.ghosting){
      return false;
    }

    if (!category){
      if (config.env !== 'production'){
        return console.warn('No category supplied to analytics event');
      }
      return false;
    }

    request.post(`${ANALYTICS_API}/event`)
      .send({
        category: category,
        action: action,
        user: {
          email: 'sara@opsee.co'
        },
        data: data
      })
      .end();
  },
  pageView(path, name){
    if (config.ghosting){
      return false;
    }

    const title = name || document.title;
    const user = { email: 'sara@opsee.co' };

    setTimeout(() => {
      request.post(`${ANALYTICS_API}/pageview`)
        .send({ path, title, user })
        .end();
    }, 0);
  }
};

export default analytics;