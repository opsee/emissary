import storage from './storage';

let scheme = storage.get('scheme');

export default function(string){
  if (string) {
    scheme = string;
    storage.set('scheme', string);
  }
  return scheme !== 'dark' ? scheme : null;
}