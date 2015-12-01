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
    all = require('gulp-load-plugins');

// Load all gulp plugins into the plugins object.
var plugins = all();

console.log(all().name);

var src = {
    html: 'src/**/*.html',
    libs: 'src/libs/**',
    scripts: {
        all: 'src/scripts/**/*.js',
        app: 'src/scripts/app.js'
    }
};

var build = 'build/';

var out = {
    libs: build + 'libs/',
    scripts: {
        file: 'app.min.js',
        folder: build + 'scripts/'
    }
};

gulp.task('html', function() {
    return gulp.src(src.html)
        .pipe(gulp.dest(build))
        //.pipe(browserSync.reload);
});

/* Compile all script files into one output minified JS file. */
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

gulp.task('serve', ['build', 'watch-all'], function() {

    browserSync.init({
        server: {
            baseDir: build
        }
    });
});

gulp.task('watch-all', function() {
    gulp.watch(src.html, ['reload']);
    gulp.watch(src.scripts.all, ['reload']);
});


gulp.task('build', ['scripts', 'html']);
gulp.task('default', ['serve']);


gulp.task('reload',['scripts', 'html'],browserSync.reload);


