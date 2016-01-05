const Nightmare = require('nightmare');
const paths = require('./paths');
const mkdirp = require('mkdirp');

const folders = ['./visreg/img', './visreg/img/base', './visreg/img/compare', './visreg/img/diff']
const folderPromises = folders.map(folder => {
  return new Promise(resolve => {
    mkdirp(folder, resolve);  
  });
});

const bannedSelectors = ['.js-components-global-loader-loader'];

module.exports = function(){
  return new Promise((masterResolve, masterReject) => {
    Promise.all(folderPromises).then(() => {
      const nightmare = Nightmare({
        width:1200,
        height:6000
      });
      function run(path) {
        console.log(`Loading /${path}...`);
        return nightmare
          .goto(`http://localhost:8080/${path}`)
          .wait(3000)
          .evaluate((bannedSelectors) => {
            const els = document.querySelectorAll(bannedSelectors.join(','));
            [].slice.call(els).forEach(el => {
              el.remove();
            });
          }, bannedSelectors)
          .wait(500)
          .screenshot(`./visreg/img/compare/${path}.png`)
      }
      var chain = paths.reduce(function(previous, item){
        return previous.then(function(){
          if (paths.indexOf(item) === paths.length - 1){
            return run(item).then(() => {
              console.log('Captured all screenshots.');
              nightmare.end(masterResolve);
            })
          }
          return run(item);
        });
      }, new Promise(resolve => resolve()));
    });
  });
}