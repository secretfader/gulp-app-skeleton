var path     = require('path')
,   express  = require('express')
,   cluster  = require('cluster')
,   os       = require('os')
,   nunjucks = require('nunjucks')
,   config   = require('config')
,   app      = module.exports = express();

/**
 * Configuration
 */
app.set('root', path.join(__dirname, 'dist'));
app.set('views', path.join(__dirname, 'views'));

nunjucks.configure(app.get('views'), {
  tags: {
    blockStart: '<%',
    blockEnd: '%>',
    variableStart: '<$',
    variableEnd: '$>',
    commentStart: '<#',
    commentEnd: '#>'
  },
  express: app
});

/**
 * Middleware
 */
if (config.get('logging')) app.use(require('morgan')('combined'));
app.use(express.static(app.get('root')));
app.use(function (req, res) {
  res.render('index.html');
});

/**
 * Boot HTTP Server
 */
if (cluster.isMaster && 'production' === config.util.getEnv('NODE_ENV')) {
  if ('gulp' !== process.title) {
    for (var i = 0; i < os.cpus().length; i++) { cluster.fork(); }
  }
} else {
  if (null === module.parent) app.listen(config.get('port'));
}

if (cluster.isMaster) process.stdout.write(
  'gulp-app-skeleton listening on port ' + config.get('port') + '...\n'
);
