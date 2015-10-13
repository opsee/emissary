export default {
  get(item){
    var item = window.localStorage[item];
    try{
      item = JSON.parse(item);
    }catch(err){
      item = null;
    }
    return item;
  },
  set(item, data){
    return window.localStorage.setItem(item, JSON.stringify(data));
  },
  remove(item){
    return delete window.localStorage[item];
  }
}