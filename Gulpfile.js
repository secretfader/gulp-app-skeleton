/**
 * Setup Environment
 */
process.title = 'gulp';

/**
 * Dependencies
 */
var config  = require('config')
,   gulp    = require('gulp')
,   queue   = require('streamqueue')
,   stream  = require('event-stream')
,   del     = require('del')
,   cleanup = require('./tasks/cleanup')
,   bower   = require('main-bower-files')()
,   $       = require('gulp-load-plugins')();

/**
 * Setup
 */
$.nunjucksRender.nunjucks.configure(['views']);

/**
 * Tasks
 */
gulp.task('test', function () {
  return gulp.src('test/*.test.js')
    .pipe($.mocha());
});

gulp.task('clean', function (done) {
  del('dist/**/*', done);
});

gulp.task('js', function () {
  var lib, app;

  lib = gulp.src(bower);
  app = gulp.src([
    'assets/js/app.js',
    'assets/js/controllers/*.js'
  ])
  .pipe($.ngAnnotate());

  return queue({ objectMode: true }, lib, app)
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
  return gulp.src('assets/css/app.styl')
    .pipe($.stylus({
      include: ['assets/css', 'vendor/css']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('assets/img/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function () {
  return gulp.src('assets/fonts/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('templates', function () {
  return gulp.src(['views/**/*.html', '!views/index.html'])
    .pipe($.nunjucksRender())
    .pipe(gulp.dest('dist'));
});

gulp.task('rev', ['js', 'css', 'images', 'fonts', 'templates'], function () {
  var assets = gulp.src([
    'dist/**/*',
    '!dist/**/*.html',
    '!dist/**/*.css',
    '!dist/**/*.js'
  ])
    .pipe($.rev());

  var css = gulp.src('dist/**/*.css')
    .pipe($.rev())
    .pipe($.csso());

  var js = gulp.src('dist/**/*.js')
    .pipe($.rev())
    .pipe($.uglify());

  var templates = gulp.src('dist/**/*.html');

  return stream.merge(assets, css, js, templates)
    .pipe($.revReplace())
    .pipe(gulp.dest('dist'))
    .pipe(cleanup())
    .pipe($.rev.manifest())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  $.livereload.listen();

  gulp.watch('assets/js/**/*.js', ['js']);
  gulp.watch('assets/css/**/*.styl', ['css']);
  gulp.watch('assets/img/*', ['images']);
  gulp.watch('assets/fonts/*', ['fonts']);
  gulp.watch('views/**/*.html', ['templates']);

  gulp.watch('dist/**/*').on('change', $.livereload.changed);

  require('./app').listen(config.get('port'));
});

gulp.task('build', [
  'js',
  'css',
  'images',
  'fonts',
  'templates',
  'rev'
]);

gulp.task('default', [
  'watch', 'js', 'css', 'images', 'fonts', 'templates'
]);
