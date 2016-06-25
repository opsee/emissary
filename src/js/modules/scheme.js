import storage from './storage';

export default function(string){
  const scheme = storage.get('scheme');
  return scheme !== 'dark' ? scheme : null;
}