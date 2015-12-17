var fs = require('fs');
var postcss = require('postcss');
var cssnext = require('cssnext');

var source = './src/js/components/global/vars.css';
var input = fs.readFileSync(source, 'utf8');
var output = postcss()
.use(cssnext())
.use((css) => {
  console.log(css.Root.nodes[0]);
})
.process(input);

fs.writeFileSync('foo.css', output);