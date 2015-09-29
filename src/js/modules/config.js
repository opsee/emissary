import storage from './storage';

let config = {
  api:window.apiDomain || 'https://api-beta.opsee.co',
  authApi:window.authApi || 'https://auth.opsee.co',
  eventsApi:window.eventsApi || 'https://events.opsee.co',
  revision:window.revision,
  apiDelay:0,
  demo:storage.get('demo') || false,
  error:false,
  slackClientSecret:window.slackClientSecret,
  intercom:window.Intercom,
  debug:storage.get('debug')
}

window.config = config;
export default config;