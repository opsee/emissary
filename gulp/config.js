const dest = './dist';
const src = './src';
const gutil = require('gulp-util');
const rewrite = require('connect-modrewrite');
const path = require('path');
const argv = require('yargs').argv;

const config = {
  server: {
    settings: {
      root: dest,
      host: 'localhost',
      port: 8080,
      livereload: false,
      middleware: function(connect, options){
        const rules = [
            "!\\.html|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.woff|\\.tiff|\\.ico|\\.gif$ /index.html"
        ];
        return [rewrite(rules)];
      }
    }
  },
  sass: {
    src: src + '/styles/**/*.{sass,scss,css}',
    dest: dest + '/styles',
    settings: {
      indentedSyntax: false, // Enable .sass syntax?
      imagePath: '/images' // Used by the image-url helper
    }
  },
  compass: {
    dist:{
      css:dest + '/styles',
      sass: src + '/styles',
      image:'public/img',
      require:['breakpoint','sass-css-importer', 'compass-flexbox'],
      httpPath:'',
      outputStyle:'compact',
      import_path:path.normalize(__dirname + '../../')
    },
    email:{
      css:'/_site/_includes',
      sass:'/scss-email',
      require:['breakpoint','sass-css-importer', 'compass-flexbox'],
      relativeAssets:true,
      noLineComments:true,
      outputStyle:'compact'
    }
  },
  browserify: {
    transform: ['babelify', 'reactify'],
    paths: ['./src/js/', './node_modules'],
    src: src + '/js/index.jsx',
    dest: dest + '/js',
    outputName: 'index.js',
    debug: gutil.env.type === 'dev'
  },
  html: {
    src: 'src/index.html',
    dest: dest
  },
  img: {
    src: 'src/img/**/*.*',
    dest: dest+'/img'
  },
  watch: {
    js: src+'/js/**/*.*',
    sass: src+'/styles/**/*.*',
    // tasks: ['build']
  },
  env:argv.env || 'development',
  api:argv.api
};

console.log('Processing project as '+config.env);
module.exports = config;