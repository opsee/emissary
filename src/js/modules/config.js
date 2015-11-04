import storage from './storage';

let config = {
  /*global __API__*/
  api: __API__ || 'https://api.opsee.com',
  /*global __AUTH__*/
  authApi: __AUTH__ || 'https://auth.opsee.com',
  revision: window.revision,
  apiDelay: storage.get('apiDelay') ? parseInt(storage.get('apiDelay'), 10) : 0,
  demo: storage.get('demo') || false,
  error: storage.get('error') || false,
  slackClientSecret: window.slackClientSecret,
  intercom: window.Intercom,
  debug: storage.get('debug') || false,
  ghosting: false,
  env: process.env
};

window.config = config;
export default config;