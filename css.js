var fs = require('fs');
var postcss = require('postcss');
var cssnext = require('cssnext');

var source = './src/js/components/global/vars.css';
var input = fs.readFileSync(source, 'utf8');

var filter = postcss.plugin('filter', opts => {
  return function (css, result){
    css.walkDecls((decl) => {
      console.log(decl.prop + decl.value);
    });
  }
})

var output = postcss([cssnext])
// .use(cssnext())
// .use(filter())
.process(input)
.then(result => {
  console.log(result.root);
  // console.log(result);
})

fs.writeFileSync('foo.css', output);