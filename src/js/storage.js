export default {
  getItem(item){
    var item = window.localStorage[item];
    return item ? JSON.parse(item) : null;
  },
  setItem(item, data){
    return window.localStorage.setItem(item, JSON.stringify(data));
  },
  removeItem(item){
    return delete window.localStorage[item];
  }
}