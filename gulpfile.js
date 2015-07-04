'use strict';

var gulp = require('gulp'),
    del = require('del'),
    path = require('path'),
    $ = require('gulp-load-plugins')(),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    sourceFile = './app/scripts/app.js',
    destFolder = './dist/scripts',
    destFileName = 'app.js';

// Styles
gulp.task('styles', ['sass']);

gulp.task('sass', function() {
  return gulp.src(['app/styles/**/*.scss', 'app/styles/**/*.css'])
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10,
      loadPath: ['app/bower_components']
    }))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('dist/styles'))
    .pipe($.size());
});

gulp.task('stylus', function() {
  return gulp.src(['app/styles/**/*.styl'])
             .pipe($.stylus())
             .pipe($.autoprefixer('last 1 version'))
             .pipe(gulp.dest('dist/styles'))
             .pipe($.size());
});

var bundler = watchify(browserify({
  entries: [sourceFile],
  debug: true,
  insertGlobals: true,
  cache: {},
  packageCache: {},
  fullPaths: true
}));

bundler.on('update', rebundle);
bundler.on('log', $.util.log);

function rebundle() {
  return bundler.bundle() // log errors if they happen
                .on('error', $.util.log.bind($.util, 'Browserify Error'))
                .pipe(source(destFileName))
                .pipe(gulp.dest(destFolder));
}

// Scripts
gulp.task('scripts', rebundle);

gulp.task('buildScripts', function() {
  return browserify(sourceFile)
      .bundle()
      .pipe(source(destFileName))
      .pipe(gulp.dest('dist/scripts'));
});

// HTML
gulp.task('html', function() {
  return gulp.src('app/*.html')
             .pipe($.useref())
             .pipe(gulp.dest('dist'))
             .pipe($.size());
});

// Images
gulp.task('images', function() {
  return gulp.src('app/images/**/*')
             .pipe($.cache($.imagemin({
               optimizationLevel: 3,
               progressive: true,
               interlaced: true
             })))
             .pipe(gulp.dest('dist/images'))
             .pipe($.size());
});

// Fonts
gulp.task('fonts', function() {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('dist/fonts'));
});

// Clean
gulp.task('clean', function(cb) {
  $.cache.clearAll();
  cb(del.sync(['dist/styles', 'dist/scripts', 'dist/images']));
});

// Bundle
gulp.task('bundle', ['styles', 'scripts', 'bower'], function() {
  return gulp.src('./app/*.html')
             .pipe($.useref.assets())
             .pipe($.useref.restore())
             .pipe($.useref())
             .pipe(gulp.dest('dist'));
});

gulp.task('buildBundle', ['styles', 'buildScripts', 'bower'], function() {
  return gulp.src('./app/*.html')
             .pipe($.useref.assets())
             .pipe($.useref.restore())
             .pipe($.useref())
             .pipe(gulp.dest('dist'));
});

// Bower helper
gulp.task('bower', function() {
  gulp.src('app/bower_components/**/*.js', {
    base: 'app/bower_components'
  }).pipe(gulp.dest('dist/bower_components/'));
});

gulp.task('json', function() {
  gulp.src('app/scripts/json/**/*.json', {
    base: 'app/scripts'
  }).pipe(gulp.dest('dist/scripts/'));
});

// Robots.txt and favicon.ico
gulp.task('extras', function() {
  return gulp.src(['app/*.txt', 'app/*.ico'])
             .pipe(gulp.dest('dist/'))
             .pipe($.size());
});

// Watch
gulp.task('watch', ['html', 'fonts', 'bundle'], function() {
  gulp.watch('app/scripts/**/*.json', ['json']);
  gulp.watch('app/*.html', ['html']);
  gulp.watch(['app/styles/**/*.scss', 'app/styles/**/*.css'], ['styles']);
  gulp.watch('app/images/**/*');
});

// Build
gulp.task('build', ['html', 'buildBundle', 'images', 'fonts', 'extras'], function() {
  gulp.src('dist/scripts/app.js')
      .pipe($.uglify())
      // .pipe($.stripDebug())
      .pipe(gulp.dest('dist/scripts'));
});

// Default task
gulp.task('default', ['clean', 'build', 'jest']);
