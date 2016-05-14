// Configuration for Gulp
var config = {
    js: {
        src: './js/main.jsx',
        watch: './js/**/*',
        outputDir: './build/',
        outputFile: 'build.js',
    },
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
            message: 'Generated file: <%= file.relative %>',
        })) // Output the file being created
        .pipe(bundleTimer) // Output time timing of the file creation
        .pipe(livereload()); // Reload the view in the browser
}

// Gulp task for build
gulp.task('default', function () {
    livereload.listen(); // Start livereload server
    var args = merge(watchify.args, { debug: true }); // Merge in default watchify args with browserify arguments

    var bundler = browserify(config.js.src, args) // Browserify
        .plugin(watchify, { ignoreWatch: ['**/node_modules/**', '**/bower_components/**'] }) // Watchify to watch source file changes
        .transform(babelify, { presets: ['es2015', 'react'] }); // Babel tranforms

    bundle(bundler); // Run the bundle the first time (required for Watchify to kick in)

    bundler.on('update', function () {
        bundle(bundler); // Re-run bundle on source updates
    });
});