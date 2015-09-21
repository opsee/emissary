import storage from './storage';

const config = {
  api:window.apiDomain || 'https://api-beta.opsee.co',
  authApi:window.authApi || 'https://auth.opsee.co',
  revision:window.revision,
  apiDelay:0,
  auth0:'https://opsee.auth0.com',
  demo:storage.get('demo') || false,
  error:false
}

export default config;