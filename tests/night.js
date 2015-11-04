const Nightmare = require('nightmare');
const vo = require('vo');
var resemble = require('resemblejs');
var fs = require('fs');

vo(run)(function(err, result) {
  if (err) throw err;
});

const size = {
  width:1200,
  height:2000
}

function *run() {
  var nightmare = Nightmare({
    width:1200,
    height:2000
  });
  var title = yield nightmare
    .goto('http://localhost:8080')
    .wait('h1')
    // .evaluate(function() {
    //   return document.querySelector('p').innerText;
    // })
    .screenshot('screenshots/foo2.png');
    console.log(title);
  yield nightmare.end();
}

// vo(compare)(function(err, result) {
//   if (err) throw err;
// });

function compare() {
  var foo = fs.openSync('./screenshots/foo.png');
  var foo2 = fs.openSync('./screenshots/foo2.png');
  resemble(foo)
  .compareTo(foo2)
  .onComplete(function(data){
    console.log(data);
  })
}

compare();