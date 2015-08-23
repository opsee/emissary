import GlobalActions from './actions/Global';

const socket = new WebSocket('ws://api-beta.opsee.co/stream/');

socket.onopen = function(event){
  GlobalActions.globalSocketAuth();
}

socket.onmessage = function(event){
  let data;
  try{
    data = JSON.parse(event.data)
  }catch(err){
    console.log(err);
    return false;
  }
  if(!data){
    return false;
  }
  GlobalActions.globalSocketMessage(data);
}

export default socket;