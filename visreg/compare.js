"use strict"

const fs = require('fs');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;
const generate = require('./generate');
const paths = require('./paths');
const colors = require('colors');
const _ = require('lodash');

generate().then(run);

let resultsArray = [];

function compare(path){
  return new Promise((resolve, reject) => {
    var oldImg = fs.createReadStream(`./visreg/img/base/${path}.png`).pipe(new PNG()).on('parsed', doneReading),
      newImg = fs.createReadStream(`./visreg/img/compare/${path}.png`).pipe(new PNG()).on('parsed', doneReading),
      filesRead = 0;
    function doneReading() {
        if (++filesRead < 2) return;
        var diff = new PNG({width: oldImg.width, height: oldImg.height});

        var numberOfPixelsChanged = pixelmatch(oldImg.data, newImg.data, diff.data, oldImg.width, oldImg.height, {threshold: 0.1});
        resultsArray.push(numberOfPixelsChanged);
        if (numberOfPixelsChanged > 0){
          const string = `Found changed pixels in /${path}. Overwrite /base/${path}.png with /compare/${path}.png and commit if intended.`.red;
          process.env.NODE_ENV === 'production' ? console.error(string) : console.warn(string);
        }
        var stream = diff.pack().pipe(fs.createWriteStream(`./visreg/img/diff/${path}.png`));
        stream.on('finish', resolve);
    }
  })
}

function run(){
  var chain = paths.reduce(function(previous, item){
    return previous.then(function(){
      if (paths.indexOf(item) === paths.length - 1){
        return compare(item).then(() => {
          console.log('Compared all images.');
          const num = _.compact(resultsArray).length ? 1 : 0;
          let string = !num ? 'No changes found.'.green : 'Changes found, exiting.'.red;
          console.log(string);
          process.exit(num);
          // masterResolve();
        })
      }
      return compare(item);
    });
  }, new Promise(resolve => resolve()));
}