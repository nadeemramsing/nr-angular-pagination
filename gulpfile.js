var
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    css2js = require('gulp-css2js'),
    del = require('del'),
    embedlr = require('gulp-embedlr'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    htmlmin = require('gulp-htmlmin'),
    ngAnnotate = require('gulp-ng-annotate'),
    runSequence = require('run-sequence'),
    templateCache = require('gulp-angular-templatecache'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    versionAppend = require('gulp-version-append'),

    dist = util.env.dist;

gulp.task('default', ['build'], function () {

});

gulp.task('build', ['index', 'cleanup', 'vendor-js'], function () {

});

gulp.task('index', function (cb) {
    if (dist)
        return cb();

    return gulp
        .src('src/demo/index.html')
        .pipe(versionAppend(['html', 'js', 'css']))
        .pipe(embedlr())
        .pipe(gulp.dest('dev'));
});

gulp.task('concat-js-html-css', ['js', 'html', 'css'], function () {
    return gulp
        .src(dist ? 'dist/**/*.temp.js' : 'dev/**/*.temp.js')
        .pipe(concat(dist ? 'nr-angular-pagination.min.js' : 'all.js'))
        .pipe(gulpif(dist, gulp.dest('dist'), gulp.dest('dev')));
});

gulp.task('js', ['demo-js'], function () {
    return gulp
        .src('src/nr-angular-pagination.js')
        .pipe(concat('1_js.temp.js'))
        .pipe(ngAnnotate())
        .pipe(gulpif(dist, uglify()))
        .pipe(gulpif(dist, gulp.dest('dist'), gulp.dest('dev')));
});

gulp.task('html', function () {
    return gulp
        .src('src/nr-angular-pagination.html')
        .pipe(gulpif(dist, htmlmin({
            collapseWhitespace: true
        })))
        .pipe(templateCache('2_html.temp.js', {
            module: 'NrAngularPagination',
            root: 'tpl'
        }))
        .pipe(gulpif(dist, uglify()))
        .pipe(gulpif(dist, gulp.dest('dist'), gulp.dest('dev')));
});

gulp.task('css', function () {
    return gulp
        .src('src/nr-angular-pagination.css')
        .pipe(css2js())
        .pipe(concat('3_css.temp.js'))
        .pipe(gulpif(dist, gulp.dest('dist'), gulp.dest('dev')));
});

gulp.task('demo-js', function (cb) {
    if (dist)
        return cb();

    return gulp
        .src('src/demo/index.js')
        .pipe(concat('4_js.temp.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('dev'));
});

gulp.task('cleanup', ['concat-js-html-css'], function () {
    return del([dist ? 'dist/*.temp.js' : 'dev/*.temp.js'])
        .catch(err => { throw err })
});

gulp.task('vendor-js', function (cb) {
    if (dist)
        return cb();

    return gulp
        .src([
            'bower_components/angular/angular.min.js',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-aria/angular-aria.min.js',
            'bower_components/angular-messages/angular-messages.min.js',
            'bower_components/angular-material/angular-material.min.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dev'));
});