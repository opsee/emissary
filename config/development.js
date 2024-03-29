export default {
  checkDefaultPath: '/markov/yield/200',
  checkDefaultPort: 8000,
  checkDefaultVerb: 'GET',
  cookieDomain: 'localhost',
  defaultBastionRegion: 'us-west-1',
  showVpcScreen: true,
  skipBastionRequirement: false,
  services: {
    analytics: 'http://localhost:9098',
    hugs: 'http://localhost:9097',
    api: 'https://api.opsee.com',
    auth: 'https://auth.opsee.com',
    stream: 'wss://api.opsee.com/stream/',
    compost: 'https://api.opsee.com/graphql',
    statusPage: 'https://mdpjjlblknkm.statuspage.io/api/v2'
  }
};
