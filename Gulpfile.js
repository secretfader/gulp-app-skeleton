/**
 * Dependencies
 */
var _       = require('lodash')
,   config  = require('config')
,   gulp    = require('gulp')
,   jade    = require('gulp-jade')
,   stylus  = require('gulp-stylus')
,   rev     = require('gulp-rev')
,   rimraf  = require('gulp-rimraf')
,   concat  = require('gulp-concat')
,   replace = require('gulp-rev-replace')
,   lr      = require('gulp-livereload')
,   stream  = require('event-stream')
,   cleanup = require('./tasks/cleanup')
,   bower   = require('main-bower-files')();

/**
 * Setup Environment
 */
process.title = 'gulp';

/**
 * Tasks
 */
gulp.task('clean', function () {
  return gulp.src('dist/**/*', { read: false })
    .pipe(rimraf());
});

gulp.task('js', function () {
  return gulp.src(_.union(bower, [
    'src/js/app.js',
    'src/js/controllers/*.js'
  ]))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
  return gulp.src('src/css/app.styl')
    .pipe(stylus({
      include: ['src/css', 'vendor/css']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('assets', function () {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('templates', function () {
  return gulp.src('src/**/*.jade')
    .pipe(jade({ doctype: 'html' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('rev', function () {
  var assets = gulp.src(['dist/**/*', '!dist/**/*.html'])
    .pipe(rev());

  var templates = gulp.src('dist/**/*.html');

  return stream.merge(assets, templates)
    .pipe(replace())
    .pipe(gulp.dest('dist'))
    .pipe(cleanup());
});

gulp.task('watch', function () {
  lr.listen();

  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/css/**/*.styl', ['css']);
  gulp.watch('src/**/*.jade', ['templates']);

  gulp.watch('dist/**/*').on('change', lr.changed);

  require('./app').listen(config.get('port'));
});

gulp.task('default', [
  'watch', 'js', 'css', 'assets', 'templates'
]);
