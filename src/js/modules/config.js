import _ from 'lodash';

let config = {
  /*global __API__*/
  /*global __AUTH__*/
  /*global __REVISION__*/
  api: __API__ || 'https://api.opsee.com',
  apiDelay: 0,
  authApi: __AUTH__ || 'https://auth.opsee.com',
  debug: false,
  demo: false,
  error: false,
  env: process.env.NODE_ENV,
  ghosting: false,
  revision: __REVISION__,
  slackClientSecret: window.slackClientSecret,
  socket: 'wss://api.opsee.com/stream/'
};

/*global __CONFIG__*/
if (config.env !== 'production' && __CONFIG__ && typeof __CONFIG__ === 'string'){
  try {
    config = _.assign(config, JSON.parse(__CONFIG__));
  }catch (err){
    console.error('Improperly formatted config file.');
  }
}

window.config = config;
export default config;