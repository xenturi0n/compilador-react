'use strict';

var gulp = require('gulp');  // Base gulp package
var babelify = require('babelify'); // Used to convert ES6 & JSX to ES5
var browserify = require('browserify'); // Providers "require" support, CommonJS
var notify = require('gulp-notify'); // Provides notification to both the console and Growel
var rename = require('gulp-rename'); // Rename sources
var sourcemaps = require('gulp-sourcemaps'); // Provide external sourcemap files
// var livereload = require('gulp-livereload'); // Livereload support for the browser
var gutil = require('gulp-util'); // Provides gulp utilities, including logging and beep
var chalk = require('chalk'); // Allows for coloring for logging
var source = require('vinyl-source-stream'); // Vinyl stream support
var buffer = require('vinyl-buffer'); // Vinyl stream support
var watchify = require('watchify'); // Watchify for source changes
var merge = require('utils-merge'); // Object merge tool
var duration = require('gulp-duration'); // Time aspects of your gulp process
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var yargs = require('yargs');
var gulpif = require('gulp-if');
var autoprefixer = require ('gulp-autoprefixer');
var cssnano = require ('gulp-cssnano');
var imagemin = require ('gulp-imagemin');
//checa el argumento --production
var PRODUCTION = !!(yargs.argv.production);




gulp.task('test', function(){
    console.log(PRODUCTION);
});


// Configuration for Gulp
var config = {
    js: {
        src: './js/main.jsx',
        watch: './js/**/*',
        outputDir: './build/',
        outputFile: 'build.js',
    },
    scss: {
        src: './src/assets/scss',
        watch: './src/assets/scss/**/*',
        outputDir: './dist/assets/css',
        inputFile: './src/assets/scss/main.scss',
        outputFile: 'styles.css'
    },
    html: {
        src: './src/*.html',
        outputDir: './dist'
    },
    images:{
        src: './src/assets/img/**/*',
        outputDir: './dist/assets/img'
    },
    copy: {
        src: ['./src/**/*', '!./src/assets/{img,js,scss}', '!./src/assets/{img,js,scss}/**/*'],
        outputDir: './dist'
    },
    server: {
        baseDir: "./",
        server: "./"
    }
};

// Error reporting function
function mapError(err) {
    if (err.fileName) {
        // Regular error
        gutil.log(chalk.red(err.name)
            + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
            + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
            + ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
            + ': ' + chalk.blue(err.description));
    } else {
        // Browserify error..
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.message));
    }
}

gulp.task('serve', function(cb){
    browserSync.init({
        server: {
            baseDir: config.server.baseDir,
            server: config.server.server
        }
    });
    
    setTimeout(function(){
        cb();
    },1000);
});


// Completes the final file outputs
function bundle(bundler) {
    var bundleTimer = duration('Javascript bundle time');

    bundler
        .bundle()
        .on('error', mapError) // Map error reporting
        .pipe(source('main.jsx')) // Set source name
        .pipe(buffer()) // Convert to gulp pipeline
        .pipe(rename(config.js.outputFile)) // Rename the output file
        .pipe(sourcemaps.init({ loadMaps: true })) // Extract the inline sourcemaps
        .pipe(sourcemaps.write('./map')) // Set folder for sourcemaps to output to
        .pipe(gulp.dest(config.js.outputDir)) // Set the output folder
        .pipe(notify({
            message: 'Archivo Generado: \n-----------\n<%= file.relative %>\n-----------',
        })) // Output the file being created
        .pipe(bundleTimer) // Output time timing of the file creation        
}

//Compila los js la Primera vez
function initBundle() {
    var args = merge(watchify.args, { debug: true }); // Merge in default watchify args with browserify arguments

    var bundler = browserify(config.js.src, args) // Browserify
        .plugin(watchify, { ignoreWatch: ['**/node_modules/**', '**/bower_components/**'] }) // Watchify to watch source file changes
        .transform(babelify, { presets: ['es2015', 'react'] }); // Babel tranforms

    bundle(bundler); // Run the bundle the first time (required for Watchify to kick in)

    bundler.on('update', function () {
        bundle(bundler); // Re-run bundle on source updates
    });
}


gulp.task('copy', function(cb){
    return gulp.src(config.copy.src)
        .pipe(gulp.dest(config.copy.outputDir))
});


gulp.task('scss', function(){
    var bundleTimer = duration('Javascript bundle time');
     
    return gulp.src(config.scss.inputFile)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({browser: 'last 2 versions'}))
        .pipe(gulpif(PRODUCTION, cssnano()))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(rename(config.scss.outputFile))
        .pipe(gulp.dest(config.scss.outputDir))
        .pipe(browserSync.stream())
        .pipe(notify({
            message: 'Archivo Generado: \n-----------\n<%= file.relative %>\n-----------',
        })) // Output the file being created
        .pipe(bundleTimer); // Output time timing of the file creation   
        
});

gulp.task('html', function(){
    return gulp.src(config.html.src)
        .pipe(gulp.dest(config.html.outputDir))
});

gulp.task('images', function(){
    return gulp.src(config.images.src)
        .pipe(gulpif(PRODUCTION, imagemin({
            progressive: true
        })))
        .pipe(gulp.dest(config.images.outputDir));
});

// Gulp task for build
gulp.task('watch', ['serve'], function(){
    // serve();
    // initBundle();
    
    // gulp.watch("build/*.js").on('change', browserSync.reload);
    gulp.watch(config.scss.watch, ['scss']);
});