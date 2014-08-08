var fs      = require('fs')
,   through = require('through2');

module.exports = function () {
  return through.obj(function (file, enc, done) {
    this.push(file);

    if (!file.revOrigPath) return done();

    fs.unlink(file.revOrigPath, function (err) {
      done();
    });
  })
};
