var system = require('system');

casper.options.verbose = true;
casper.options.pageSettings.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36";
casper.test.begin('Ensure proper build', 1, function(test){
  casper.start('http://localhost:8080/login', function(){
    this.on('page.error', function(msg, trace){
      this.echo('Error: '+msg, 'ERROR');
    });
    this.on('remote.message', function(msg, trace){
      this.echo('From browser: '+msg);
    });
    casper.waitForSelector('h1', function(){
      console.log('found login h1');
      casper.fill('form[name="loginForm"]', {
        email: system.env.opseeEmail,
        password: system.env.opseePassword
      }, true);
      casper.waitFor(function(){
        return this.evaluate(function(){
          return document.querySelector('h1').innerText === 'Checks';
        });
      }, function(){
        test.pass('found checks page');
      });
    }, function(){
      test.fail('Could not find h1');
    }, 20000);
  });
  casper.run(function(){
    test.done();
  });
});