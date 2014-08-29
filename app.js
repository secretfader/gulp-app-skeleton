var path    = require('path')
,   express = require('express')
,   cluster = require('cluster')
,   os      = require('os')
,   config  = require('config')
,   app     = module.exports = express();

app.set('root', path.join(__dirname, 'dist'));
app.set('logging', !config.get('test?'));

if (app.get('logging')) app.use(require('morgan')('combined'));
app.use(express.static(app.get('root')));

app.route('*')
  .get(function (req, res) {
    res.sendFile(path.join(app.get('root'), 'index.html'));
  });

if (cluster.isMaster && config.get('production?')) {
  if ('gulp' !== process.title) {
    for (var i = 0; i < os.cpus().length; i++) { cluster.fork(); }
  }
} else {
  if (null === module.parent) app.listen(config.get('port'));
}

if (cluster.isMaster) process.stdout.write(
  'gulp-app-skeleton listening on port ' + config.get('port') + '...\n'
);
