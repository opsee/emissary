import storage from './storage';

let config = {
  /*global __API__*/
  /*global __AUTH__*/
  /*global __REVISION__*/
  api: __API__ || 'https://api.opsee.com',
  apiDelay: storage.get('apiDelay') ? parseInt(storage.get('apiDelay'), 10) : 0,
  authApi: __AUTH__ || 'https://auth.opsee.com',
  debug: storage.get('debug') || false,
  demo: storage.get('demo') || false,
  error: storage.get('error') || false,
  env: process.env.NODE_ENV,
  ghosting: false,
  intercom: window.Intercom,
  revision: __REVISION__,
  slackClientSecret: window.slackClientSecret,
  socket: 'wss://api.opsee.com/stream/'
};

window.config = config;
export default config;