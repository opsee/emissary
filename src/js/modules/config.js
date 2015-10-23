import storage from './storage';

let config = {
  api:__API__ || 'https://api-beta.opsee.co',
  authApi:__AUTH__ || 'https://auth.opsee.co',
  eventsApi:__EVENTS__ || 'https://events.opsee.co',
  revision:window.revision,
  apiDelay:storage.get('apiDelay') ? parseInt(storage.get('apiDelay'), 10) : 0,
  demo:storage.get('demo') || false,
  error:storage.get('error') || false,
  slackClientSecret:window.slackClientSecret,
  intercom:window.Intercom,
  debug:storage.get('debug') || false,
  ghosting:false
}

window.config = config;
export default config;