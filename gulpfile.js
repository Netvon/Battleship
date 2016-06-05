'use strict';

let gulp = require('gulp');
let babelify = require('babelify');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let sass = require('gulp-sass');
let uglify = require('gulp-uglify');
let ghPages = require('gulp-gh-pages');

gulp.task('es6', () => {
    browserify('./src/js/main.js')
        .transform('babelify')
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('sass', () => {
    gulp.src('./src/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        //.pipe(uglify())
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('normalize', () => {
   gulp.src('./node_modules/normalize.css/normalize.css')
       .pipe(gulp.dest('./dist/css/vendor'));
});

gulp.task('enjoy', () => {
    gulp.src('./src/css/enjoy.css')
        .pipe(gulp.dest('./dist/css/vendor'));
});

gulp.task('deploy', ['es6', 'sass', 'normalize', 'enjoy'],  () => {
   gulp.src('./dist/**/*')
       .pipe(ghPages({
           "remoteUrl" : "git@github.com:Netvon/Battleship.git"
       }));
});

gulp.task('default', ['es6', 'sass', 'normalize', 'enjoy'], () => {
    gulp.watch('./src/js/**/*.js', ['es6']);
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch('./node_modules/normalize.css/**/*.*', ['normalize']);
});