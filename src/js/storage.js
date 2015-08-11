export default {
  get(item){
    var item = window.localStorage[item];
    return item ? JSON.parse(item) : null;
  },
  set(item, data){
    return window.localStorage.setItem(item, JSON.stringify(data));
  },
  remove(item){
    return delete window.localStorage[item];
  }
}