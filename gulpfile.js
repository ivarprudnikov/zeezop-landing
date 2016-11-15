var gulp = require('gulp');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

var pkg = require('./package.json');
var dirs = pkg['app-configs'].directories;

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('clean', function (done) {
    require('del')([
        dirs.dist
    ]).then(function () {
        done();
    });
});

gulp.task('copy', [
    'copy:index.html',
    'copy:main.css',
    'copy:misc',
    'copy:normalize'
]);

gulp.task('copy:index.html', function () {
    return gulp.src(dirs.src + '/index.html')
               .pipe(plugins.replace(/{{JQUERY_VERSION}}/g, pkg.devDependencies.jquery))
               .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:main.css', function () {

    var banner = '/*! v' + pkg.version + ' */\n\n';

    return gulp.src(dirs.src + '/css/main.css')
               .pipe(plugins.header(banner))
               .pipe(plugins.autoprefixer({
                   browsers: ['last 2 versions', 'ie >= 9', '> 1%'],
                   cascade: false
               }))
               .pipe(gulp.dest(dirs.dist + '/css'));
});

gulp.task('copy:misc', function () {
    return gulp.src([

        // Copy all files
        dirs.src + '/**/*',

        // Exclude the following files
        // (other tasks will handle the copying of these files)
        '!' + dirs.src + '/css/main.css',
        '!' + dirs.src + '/index.html'

    ], {

        // Include hidden files by default
        dot: true

    }).pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:normalize', function () {
    return gulp.src('node_modules/normalize.css/normalize.css')
               .pipe(gulp.dest(dirs.dist + '/css'));
});

// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('build', function (done) {
    runSequence(
        'clean',
        'copy',
    done);
});

gulp.task('default', ['build']);
