import router from './router.jsx';

export default function(res){
  console.log(res.response);
  const p = new Promise((resolve, reject) => {
    resolve();
    // router.transitionTo('login');
  });
  return p;
}