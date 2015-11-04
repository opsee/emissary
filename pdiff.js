/*
  Require and initialise PhantomCSS module
  Paths are relative to CasperJs directory
*/

var fs = require( 'fs' );
var phantomcss = require('phantomcss');

casper.userAgent('"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36"')

casper.test.begin( 'Coffee machine visual tests', function ( test ) {

  phantomcss.init({
    rebase: casper.cli.get( "rebase" ),
    // SlimerJS needs explicit knowledge of this Casper, and lots of absolute paths
    casper: casper,
    libraryRoot: fs.absolute( fs.workingDirectory + '' ),
    screenshotRoot: fs.absolute( fs.workingDirectory + '/screenshots' ),
    failedComparisonsRoot: fs.absolute( fs.workingDirectory + '/demo/failures' ),
    addLabelToFailedImage: false,
    /*
    screenshotRoot: '/screenshots',
    failedComparisonsRoot: '/failures'
    casper: specific_instance_of_casper,
    libraryRoot: '/phantomcss',
    fileNameGetter: function overide_file_naming(){},
    onPass: function passCallback(){},
    onFail: function failCallback(){},
    onTimeout: function timeoutCallback(){},
    onComplete: function completeCallback(){},
    hideElements: '#thing.selector',
    addLabelToFailedImage: true,
    outputSettings: {
      errorColor: {
        red: 255,
        green: 255,
        blue: 0
      },
      errorType: 'movement',
      transparency: 0.3
    }*/
  });

  casper.on( 'remote.message', function ( msg ) {
    this.echo( msg );
  })

  casper.on( 'error', function ( err ) {
    this.die( "PhantomJS has errored: " + err );
  });

  casper.on( 'resource.error', function ( err ) {
    casper.log( 'Resource load error: ' + err, 'warning' );
  });
  /*
    The test scenario
  */
  casper.start('http://localhost:8080');

  // casper.viewport( 1024, 768 );

  casper.waitForSelector('h1', function(){
    phantomcss.screenshot( 'h1', 'h1');
    phantomcss.screenshot( 'img[alt="Opsee logo"]', 'logo');
  });

  /*
  Casper runs tests
  */
  casper.run( function () {
    console.log( '\nTHE END.' );
    // phantomcss.getExitStatus() // pass or fail?
    casper.test.done();
  });
});
