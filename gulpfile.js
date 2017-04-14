var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var pugInheritance = require('gulp-pug-inheritance');
var pug = require('gulp-pug');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var cached = require('gulp-cached');
var gulp_watch_pug = require('gulp-watch-pug');
var gulpif = require('gulp-if');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var newer = require('gulp-newer');
var debug = require('gulp-debug');
var inlineCss = require('gulp-inline-css');
var rename = require("gulp-rename");
var reload = browserSync.reload;

// gulp.task('default', ['imagemin', 'jshint', 'templates', 'sass', 'watch']);

// run this task by typing in gulp jade in CLI
gulp.task('templates', function() {
  return gulp.src('src/templates/**/*.pug')
    .pipe(plumber())
    .pipe(debug({title: 'Pug debug:'}))
    .pipe(newer('./'))
    .pipe(filter(function (file) {
        return !/\/_/.test(file.path) && !/^_/.test(file.relative);
    }))
    .pipe(pug({ pretty: true })) // pipe to jade plugin
    .pipe(gulp.dest('./html')) // tell gulp our output folder
});

gulp.task('pug-watch', ['templates'], reload);

gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('imagemin', function() {
  return gulp.src('./src/images/**/*')
    .pipe(changed('./src/images'))
    .pipe(imagemin())
    .pipe(gulp.dest('./images'))
});

gulp.task('inline', function() {
  return gulp.src('./html/*.html')
      .pipe(inlineCss({
            applyStyleTags: true,
            applyLinkTags: true,
            removeStyleTags: true,
            removeLinkTags: true
      }))
      .pipe(debug({title: 'Pug inlineCSS debug:'}))
      .pipe(gulp.dest('./'));
});

gulp.task('inlineCss', ['inline'], reload);

gulp.task('default', ['sass', 'imagemin', 'templates', 'inline'], function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/images/*', ['imagemin']);
  gulp.watch('src/templates/**/*.pug', ['pug-watch']);
  gulp.watch('css/**/*.css', ['inlineCss']);
  browserSync({server: './'});
});

gulp.task('prod', ['sass', 'imagemin', 'templates', 'inline'], function () {
  browserSync({server: './html/'});
  gulp.watch('templates/**/*.pug', ['pug-watch']);
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('images/*', ['imagemin']);
  gulp.watch('css/**/*.css', ['inlineCss']);
  // rename via string
  gulp.src("html/index.html")
    .pipe(rename("page.tpl.php"))
    .pipe(gulp.dest(""));
});
