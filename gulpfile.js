/**
 * Created by gurpreet2217 on 12/1/2015.
 */

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    vinylSourceStream = require('vinyl-source-stream'),
    vinylBuffer = require('vinyl-buffer'),
    util = require('gulp-util'),
    jade = require('gulp-jade');

// load all gulp plugins into the plugins object
var plugins = require('gulp-load-plugins')();

// set paths and glob patterns 
var src = {
    html: 'src/**/*.html',
    jade: 'src/**/*.jade',
    libs: 'src/libs/**',
    scripts: {
        all: 'src/scripts/**/*.js',
        app: 'src/scripts/app.js'
    }
};

// build folder 
var build = 'build/';

// destination path
var out = {
    libs: build + 'libs/',
    scripts: {
        file: 'app.min.js',
        folder: build + 'scripts/'
    }
};


// compile all javascript files into one output minified JS file. 
gulp.task('scripts',  function() {

    var sources = browserify({
        entries: src.scripts.app,
        debug: true // Build source maps
    })
        .transform(babelify.configure({
            // You can configure babel here!
            // https://babeljs.io/docs/usage/options/
        }));

    return sources.bundle()
        .pipe(vinylSourceStream(out.scripts.file))
        .pipe(vinylBuffer())
        .pipe(plugins.sourcemaps.init({
            loadMaps: true // Load the sourcemaps browserify already generated
        }))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('./', {
            includeContent: true
        }))
        .pipe(gulp.dest(out.scripts.folder));
});

// serve on default port 3002 //
gulp.task('serve', ['build', 'watch-all'], function() {
    browserSync.init({
        server: {
            baseDir: build
        }
    });
});

// watch files //
gulp.task('watch-all', function() {
    gulp.watch(src.html, ['reload']);
    gulp.watch(src.jade, ['reload']);
    gulp.watch(src.scripts.all, ['reload']);
});

// build task //
gulp.task('build', ['scripts', 'jade']);

// set default task as serve //
gulp.task('default', ['serve']);

// reload browsers //
gulp.task('reload',['jade', 'scripts'],browserSync.reload);

// jade to html conversion //
gulp.task('jade', function() {
    gulp.src(src.jade)
        .pipe(jade({}))
        .pipe(gulp.dest(build))
});


