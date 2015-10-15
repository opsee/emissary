casper.options.verbose = true;
casper.options.pageSettings.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36";
casper.test.begin('Ensure proper build', 1, function(test){
  casper.start('http://localhost:8080/login', function(){
    casper.waitForSelector('h1', function pass(){
      test.pass('Found h1');
    },
    function fail(){
      test.fail('Could not find h1');
    }, 20000);
  });
  casper.run(function(){
    test.done();
  });
});

// var casper = require('casper').create();
// casper.on('remote.message', function(msg){
//   casper.echo('From browser: '+msg);
// })
// casper.start();
// debugger;
// casper.thenOpen('http://localhost:8080', function(){
//   casper.waitForSelector('h1', function(){
//     var text = this.evaluate(function(){
//       return document.querySelector('h1').textContent;
//     })
//     this.echo(text);
//   }, null, 15000)
// });
// casper.run(function(){
//   this.exit();
// });

// var text = __utils__.findOne('h1').textContent.toLowerCase();