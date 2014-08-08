var path    = require('path')
,   express = require('express')
,   cluster = require('cluster')
,   os      = require('os')
,   config  = require('config')
,   app     = module.exports = express();

app.use(express.static(path.join(__dirname, 'dist')));

if (cluster.isMaster && config.get('production?')) {
  for (var i = 0; i < os.cpus().length; i++) { cluster.fork(); }
} else {
  if (null === module.parent) app.listen(config.get('port'));
}

process.stdout.write(
  'gulp-app-skeleton listening on port ' + config.get('port') + '...\n'
);
