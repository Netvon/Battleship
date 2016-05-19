const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sass = require('gulp-sass');

gulp.task('es6', () => {
    browserify('src/js/main.js')
        .transform('babelify', {
            presets: ['es2015']
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest('public/js/'));
});

gulp.task('sass', () => {
    return gulp.src('src/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/css/'));
});

gulp.task('default', ['es6', 'sass'], () => {
    gulp.watch('src/js/**/*.js', ['es6']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
});