'use strict';

let gulp = require('gulp');
let babelify = require('babelify');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let sass = require('gulp-sass');
let uglify = require('gulp-uglify');

gulp.task('es6', () => {
    browserify('src/js/main.js')
        .transform('babelify', {
            presets: ['es2015']
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        //.pipe(uglify())
        .pipe(gulp.dest('public/js/'));
});

gulp.task('sass', () => {
    gulp.src('src/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        //.pipe(uglify())
        .pipe(gulp.dest('public/css/'));
});

gulp.task('normalize', () => {
   gulp.src('node_modules/normalize.css/normalize.css')
       .pipe(gulp.dest('public/css/vendor'));
});

gulp.task('default', ['es6', 'sass', 'normalize'], () => {
    gulp.watch('src/js/**/*.js', ['es6']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('node_modules/normalize.css/**/*.*', ['normalize']);
});