export default {
  get(string){
    let local = window.localStorage[string];
    try {
      local = JSON.parse(local);
    }catch (err){
      local = null;
    }
    return local;
  },
  set(string, data){
    return window.localStorage.setItem(string, JSON.stringify(data));
  },
  remove(string){
    return delete window.localStorage[string];
  }
};